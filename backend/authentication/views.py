from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

from rest_framework import status
from rest_framework.response import Response
from .serializers import PasswordResetRequestSerializer, SetNewPasswordSerializer
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_bytes, smart_str, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.core.mail import EmailMessage
import threading

class EmailThread(threading.Thread):
    def __init__(self, email_message):
        self.email_message = email_message
        threading.Thread.__init__(self)

    def run(self):
        self.email_message.send()

class RequestPasswordResetEmail(generics.GenericAPIView):
    serializer_class = PasswordResetRequestSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        
        email = request.data.get('email', '')

        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            
            # frontend_url = 'http://localhost:5173/reset-password' # Localhost for now
            # In production, this should be an environment variable
            
            absurl = f'http://localhost:5173/reset-password/{uidb64}/{token}'
            
            email_body = f'Hello {user.name}, \nUse link below to reset your password  \n{absurl}'
            
            data = {'email_body': email_body, 'to_email': user.email, 'email_subject': 'Reset your password'}
            
            email = EmailMessage(
                subject=data['email_subject'],
                body=data['email_body'], 
                to=[data['to_email']]
            )
            EmailThread(email).start()
            
            return Response({'success': 'We have sent you a link to reset your password'}, status=status.HTTP_200_OK)
            
        return Response({'success': 'We have sent you a link to reset your password'}, status=status.HTTP_200_OK) # Do not reveal if user does not exist security practice

class PasswordResetConfirm(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer
    permission_classes = (AllowAny,)

    def patch(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'success': True, 'message': 'Password reset success'}, status=status.HTTP_200_OK)
