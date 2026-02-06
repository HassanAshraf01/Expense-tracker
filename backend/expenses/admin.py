from django.contrib import admin
from .models import Expense, Budget

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('title', 'amount', 'category', 'date', 'user', 'created_at') # Added created_at
    list_filter = ('category', 'date', 'user')
    search_fields = ('title', 'category', 'user__username', 'user__email') # Search by user email too
    ordering = ('-date', '-created_at')
    date_hierarchy = 'date'
    readonly_fields = ('created_at', 'updated_at') # Prevent specific edits

@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ('user', 'month', 'total_balance', 'alert_limit', 'alert_sent')
    list_filter = ('user', 'month')
