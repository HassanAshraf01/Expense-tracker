from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Expense, Budget
from django.db.models import Sum
from django.core.mail import send_mail
from django.conf import settings
import datetime

def check_budget_limit(user, date):
    # Determine the month for the expense
    # Budget month is stored as the first day of the month
    budget_month = date.replace(day=1)
    
    try:
        budget = Budget.objects.get(user=user, month=budget_month)
    except Budget.DoesNotExist:
        return

    # Calculate total spent for this month
    # We need to filter expenses by month and year
    total_spent = Expense.objects.filter(
        user=user, 
        date__year=date.year, 
        date__month=date.month
    ).aggregate(Sum('amount'))['amount__sum'] or 0

    # Check logic
    if total_spent > budget.alert_limit and not budget.alert_sent:
        # Send Email
        try:
            send_mail(
                subject=f'Spending Alert: Limit Exceeded for {date.strftime("%B %Y")}',
                message=f'''Hello {user.name},

You have exceeded your spending alert limit for {date.strftime("%B %Y")}.

Budget Limit Alert: {budget.alert_limit}
Total Spent So Far: {total_spent}
Remaining Balance: {budget.total_balance - total_spent}

Please review your expenses to stay on track.

Regards,
Budget Manager
Expense Tracker App
''',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
                fail_silently=True,
            )
            # Mark alert as sent
            budget.alert_sent = True
            budget.save()
        except Exception as e:
            print(f"Error sending budget alert email: {e}")

@receiver(post_save, sender=Expense)
def expense_saved(sender, instance, **kwargs):
    check_budget_limit(instance.user, instance.date)

@receiver(post_delete, sender=Expense)
def expense_deleted(sender, instance, **kwargs):
    # Even on delete, we might want to check (though usually it lowers usage)
    # But if we want to support un-setting the alert_sent flag if they go back under, we would do it here.
    # The requirement says "Alert email is sent only once", implying we don't spam.
    # But if they delete a huge expense, maybe we should reset? 
    # For now, adhering to 'once per month' as per prompt instructions implies we assume latching, 
    # but strictly speaking checking every time ensures consistency.
    # We will NOT reset 'alert_sent' based on the prompt's simplicity preference ("once per month").
    pass
