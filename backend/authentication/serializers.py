from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.validators import UniqueValidator

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # Add extra data to response
        data['name'] = self.user.name
        data['email'] = self.user.email
        return data

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    username = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="The username is taken already"
            )
        ]
    )

    class Meta:
        model = User
        fields = ('name', 'email', 'username', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            name=validated_data['name'],
            password=validated_data['password']
        )
        
        # Send welcome email
        def send_welcome_email():
            try:
                from django.core.mail import send_mail
                from django.conf import settings
                send_mail(
                    subject='Account Created Successfully',
                    message=f'Hello {user.name},\n\nYour account has been created successfully. Welcome to Expense Tracker!',
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[user.email],
                    fail_silently=True,
                )
            except Exception as e:
                print(f"Failed to send email: {e}")

        # Run email sending in a separate thread so it doesn't block response
        import threading
        email_thread = threading.Thread(target=send_welcome_email)
        email_thread.start()

        return user

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(min_length=2)

    class Meta:
        fields = ['email']

class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=6, max_length=68, write_only=True)
    confirm_password = serializers.CharField(min_length=6, max_length=68, write_only=True)
    uidb64 = serializers.CharField(min_length=1, write_only=True)
    token = serializers.CharField(min_length=1, write_only=True)

    class Meta:
        fields = ['password', 'confirm_password', 'uidb64', 'token']

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')
        token = attrs.get('token')
        uidb64 = attrs.get('uidb64')

        if password != confirm_password:
            raise serializers.ValidationError("Passwords do not match")

        try:
            from django.utils.http import urlsafe_base64_decode
            from django.utils.encoding import force_str
            id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)
            
            from django.contrib.auth.tokens import PasswordResetTokenGenerator
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise serializers.ValidationError('The reset link is invalid', 401) # Check 1

            self.user = user  # Attach user to serializer instance for reference
        except Exception:
            raise serializers.ValidationError('The reset link is invalid', 401) # Check 2

        return attrs

    def save(self):
        password = self.validated_data['password']
        self.user.set_password(password)
        self.user.save()
        return self.user
