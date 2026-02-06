import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_core.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

emails = ['hassu003.lko@gmail.com', 'hassaanashraf886@gmail.com']
new_password = 'password123'

for email in emails:
    try:
        user = User.objects.get(email=email)
        user.set_password(new_password)
        user.save()
        print(f"Successfully reset password for {email} to '{new_password}'")
    except User.DoesNotExist:
        print(f"User with email {email} not found")
