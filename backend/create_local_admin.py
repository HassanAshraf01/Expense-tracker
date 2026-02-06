import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_core.settings')
django.setup()

from django.contrib.auth import get_user_model

def create_local_admin():
    User = get_user_model()
    target_email = 'hassu003.lko@gmail.com'
    target_username = 'hassu003'
    target_password = 'Hassan123'
    
    # 1. Delete the old default admin if it exists
    old_email = 'admin@example.com'
    if User.objects.filter(email=old_email).exists():
        print(f"Removing old admin user: {old_email}")
        User.objects.get(email=old_email).delete()

    # 2. Create or Update the new admin
    if not User.objects.filter(email=target_email).exists():
        print(f"Creating new superuser: {target_email}")
        User.objects.create_superuser(
            email=target_email,
            username=target_username,
            password=target_password,
            name='Admin'
        )
    else:
        print(f"Updating existing user to admin: {target_email}")
        user = User.objects.get(email=target_email)
        user.set_password(target_password)
        user.is_staff = True
        user.is_superuser = True
        user.save()
    
    print("Admin setup complete.")

if __name__ == '__main__':
    create_local_admin()
