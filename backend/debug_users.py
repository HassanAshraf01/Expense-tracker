import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_core.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

print("Listing all users:")
for user in User.objects.all():
    print(f"ID: {user.id} | Email: {user.email} | Username: {user.username} | Name: {user.name} | Active: {user.is_active} | Staff: {user.is_staff}")
