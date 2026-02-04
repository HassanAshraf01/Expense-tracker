
# Navigate to backend
Set-Location "c:\Users\Lenovo\OneDrive\Desktop\expense and Subscription management\backend"

# Create logical venv
python -m venv venv

# Activate venv
.\venv\Scripts\Activate.ps1

# Install requirements
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers

# Start Project (if not exists)
if (-not (Test-Path "backend_core")) {
    django-admin startproject backend_core .
}

# Create App (if not exists)
if (-not (Test-Path "authentication")) {
    python manage.py startapp authentication
}
