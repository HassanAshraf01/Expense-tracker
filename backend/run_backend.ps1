
# Navigate to backend
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Activate venv
.\venv\Scripts\Activate.ps1

# Make Migrations
python manage.py makemigrations authentication
python manage.py migrate

# Run Server
python manage.py runserver
