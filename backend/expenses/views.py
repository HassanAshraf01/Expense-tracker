from rest_framework import generics, permissions
from .models import Expense
from .serializers import ExpenseSerializer

class ExpenseListCreateView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        amount = serializer.validated_data['amount']
        date = serializer.validated_data['date']
        
        # Check Budget Logic
        # 1. Get Budget for the expense month
        budget_month = date.replace(day=1)
        try:
            budget = Budget.objects.get(user=user, month=budget_month)
            
            # 2. Calculate Total Spent so far in this month
            from django.db.models import Sum
            total_spent = Expense.objects.filter(
                user=user, 
                date__year=date.year, 
                date__month=date.month
            ).aggregate(Sum('amount'))['amount__sum'] or 0
            
            # 3. Check if new amount pushes over total_balance
            if (total_spent + amount) > budget.total_balance:
                from rest_framework.exceptions import ValidationError
                raise ValidationError({
                    "budget_limit_exceeded": "Total spent exceeds the total balance.",
                    "redirect": "/budget"
                })

        except Budget.DoesNotExist:
            pass # No budget set, proceed normally

        serializer.save(user=user)

class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)

from .models import Budget
from .serializers import BudgetSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
import datetime

class BudgetView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Get budget for current month (or specified month)
        # For simplicity, defaults to current month
        now = datetime.datetime.now()
        month_str = request.query_params.get('month') # Format YYYY-MM-DD
        
        if month_str:
            try:
                date = datetime.datetime.strptime(month_str, '%Y-%m-%d').date()
            except ValueError:
                return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            date = now.date().replace(day=1)
            
        try:
            budget = Budget.objects.get(user=request.user, month=date)
            serializer = BudgetSerializer(budget)
            return Response(serializer.data)
        except Budget.DoesNotExist:
            return Response({}) # Return empty if no budget set

    def post(self, request):
        serializer = BudgetSerializer(data=request.data)
        if serializer.is_valid():
            # Handle month logic - ensure it is saved as first day of month
            month_val = serializer.validated_data['month']
            month_first = month_val.replace(day=1)
            
            # Check if exists to update or create
            budget, created = Budget.objects.update_or_create(
                user=request.user,
                month=month_first,
                defaults={
                    'total_balance': serializer.validated_data['total_balance'],
                    'alert_limit': serializer.validated_data['alert_limit'],
                    'alert_sent': False # Reset alert on update? Maybe. Let's say yes for now if they change limits.
                }
            )
            
            # Re-serialize to return full object
            return Response(BudgetSerializer(budget).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
