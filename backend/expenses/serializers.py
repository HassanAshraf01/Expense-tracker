from rest_framework import serializers
from .models import Expense

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['id', 'title', 'amount', 'category', 'date', 'created_at']
        read_only_fields = ['id', 'created_at']

from .models import Budget
class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ['id', 'month', 'total_balance', 'alert_limit', 'alert_sent']
        read_only_fields = ['id', 'alert_sent']

    def validate(self, data):
        if data['alert_limit'] > data['total_balance']:
            raise serializers.ValidationError("Alert limit cannot be greater than total balance.")
        if data['alert_limit'] < 0 or data['total_balance'] < 0:
            raise serializers.ValidationError("Amounts must be positive.")
        return data
