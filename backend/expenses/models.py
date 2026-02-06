from django.db import models
from django.conf import settings

from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.utils import timezone

def validate_not_future(value):
    if value > timezone.now().date():
        raise ValidationError('Date cannot be in the future.')

class Expense(models.Model):
    CATEGORY_CHOICES = [
        ('Food', 'Food'),
        ('Transportation', 'Transportation'),
        ('Subscription', 'Subscription'),
        ('Housing', 'Housing'),
        ('Entertainment', 'Entertainment'),
        ('Shopping', 'Shopping'),
        ('Health', 'Health'),
        ('Education', 'Education'),
        ('Other', 'Other'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='expenses')
    title = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)])
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    date = models.DateField(validators=[validate_not_future])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.title} - {self.amount}"

class Budget(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='budgets')
    month = models.DateField(help_text="Stores the first day of the month") 
    total_balance = models.DecimalField(max_digits=12, decimal_places=2)
    alert_limit = models.DecimalField(max_digits=12, decimal_places=2)
    alert_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'month')
        ordering = ['-month']

    def __str__(self):
        return f"{self.user.username} - {self.month.strftime('%B %Y')}"
