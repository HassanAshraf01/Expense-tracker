import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_core.settings')
django.setup()

from django.contrib.auth import get_user_model

def create_or_update_superuser():
    User = get_user_model()
    email = "hassu003.lko@gmail.com"
    password = "HassuCoder2003"

    try:
        # Check if user exists (using email as it's the USERNAME_FIELD)
        try:
            user = User.objects.get(email=email)
            print(f"User {email} found. Updating permissions...")
        except User.DoesNotExist:
            print(f"User {email} not found. Creating new superuser...")
            user = User(email=email)
            user.name = "Hassu Admin" # Default name
        
        # Set attributes
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        
        # Since we are using Custom User model where username field might be different or unused if strictly email
        # But AbstractUser usually necessitates a username.
        # Let's check the model definition again mentally. USERNAME_FIELD = 'email'.
        # However, the underlying AbstractUser still has a 'username' field usually.
        # To be safe, let's set a username if it's empty, though existing logic suggests email login.
        if not user.username:
             user.username = email.split('@')[0]

        user.save()
        print(f"SUCCESS: User {email} is now a Superuser and Staff with the specified password.")

    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    create_or_update_superuser()
