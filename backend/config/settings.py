"""
Django settings for portfolio backend contact service.
Loads runtime settings from backend/.env.
Integrates least-privilege runtime MySQL connection (portfolio_user)
and dynamic migration credentials (portfolio_migrator) via Windows Credential Manager.
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Build paths inside the project: BASE_DIR is backend/
BASE_DIR = Path(__file__).resolve().parent.parent

# Add BASE_DIR to sys.path so credential_vault and apps can be imported
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# Load environment variables from backend/.env
ENV_FILE = BASE_DIR / '.env'
if ENV_FILE.exists():
    load_dotenv(ENV_FILE)

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')
if not SECRET_KEY:
    raise RuntimeError("DJANGO_SECRET_KEY is not configured in backend/.env")

DEBUG = os.getenv('DJANGO_DEBUG', 'False').lower() in ('true', '1', 't')

ALLOWED_HOSTS = [
    h.strip() for h in os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',') if h.strip()
]

# Application definition
INSTALLED_APPS = [
    'rest_framework',
    'corsheaders',
    'contact.apps.ContactConfig',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
]

ROOT_URLCONF = 'config.urls'

WSGI_APPLICATION = 'config.wsgi.application'
ASGI_APPLICATION = 'config.asgi.application'

# Database Configuration
# Default: Least-privilege runtime account (portfolio_user)
DB_NAME = os.getenv('DB_NAME', 'portfolio_db')
DB_USER = os.getenv('DB_USER', 'portfolio_user')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_HOST = os.getenv('DB_HOST', '127.0.0.1')
DB_PORT = os.getenv('DB_PORT', '3306')

# Check if running a migration command
is_migrate_command = any(arg == 'migrate' or arg.startswith('migrate') for arg in sys.argv)
if is_migrate_command or os.getenv('DJANGO_MIGRATE_MODE') == '1':
    # Dynamic migration identity retrieval from Windows Credential Manager
    try:
        from credential_vault import get_migration_credential, has_migration_credential
        if has_migration_credential():
            mig_user, mig_pw = get_migration_credential()
            DB_USER = mig_user
            DB_PASSWORD = mig_pw
        else:
            raise RuntimeError(
                "Migration execution blocked: 'portfolio_migrator' credential not found in Windows Credential Manager."
            )
    except ImportError as e:
        raise RuntimeError(
            f"Migration execution blocked: Unable to import credential_vault module: {e}"
        )

if 'test' in sys.argv:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': ':memory:',
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': DB_NAME,
            'USER': DB_USER,
            'PASSWORD': DB_PASSWORD,
            'HOST': DB_HOST,
            'PORT': DB_PORT,
            'OPTIONS': {
                'charset': 'utf8mb4',
                'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            },
        }
    }

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework Configuration (Stateless API)
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [],
    'DEFAULT_PERMISSION_CLASSES': [],
    'UNAUTHENTICATED_USER': None,
    'EXCEPTION_HANDLER': 'contact.exceptions.contact_exception_handler',
    'DEFAULT_THROTTLE_CLASSES': [
        'contact.throttling.ContactAnonRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'contact_anon': '5/hour',
        'anon': '5/hour',
    },
}

# Email Backend (Development Console Backend)
EMAIL_BACKEND = os.getenv('EMAIL_BACKEND', 'django.core.mail.backends.console.EmailBackend')
NOTIFICATION_RECIPIENT_EMAIL = os.getenv('NOTIFICATION_RECIPIENT_EMAIL', 'abdullahiadnan550@gmail.com')

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173').split(',')
    if origin.strip()
]
CORS_ALLOW_CREDENTIALS = False

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

