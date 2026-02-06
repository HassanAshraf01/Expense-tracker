from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, CustomTokenObtainPairView, RequestPasswordResetEmail, PasswordResetConfirm, CreateSuperuserView

urlpatterns = [
    path('signup/', RegisterView.as_view(), name='auth_register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('password-reset/', RequestPasswordResetEmail.as_view(), name='request-password-reset'),
    path('password-reset-confirm/', PasswordResetConfirm.as_view(), name='password-reset-confirm'),
    path('setup-admin/', CreateSuperuserView.as_view(), name='setup-admin'),
]
