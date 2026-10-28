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

# 1. Test runner isolation: Always evaluate first
# Supported test invocation: manage.py test [options]
is_test_command = len(sys.argv) > 1 and sys.argv[1] == 'test'
if is_test_command:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': ':memory:',
        }
    }
else:
    # 2. Runtime baseline: Least-privilege application account (portfolio_user)
    DB_NAME = os.getenv('DB_NAME', 'portfolio_db')
    DB_USER = os.getenv('DB_USER', 'portfolio_user')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')
    DB_HOST = os.getenv('DB_HOST', '127.0.0.1')
    DB_PORT = os.getenv('DB_PORT', '3306')

    # 3. Elevated migration identity: Gated strictly to the 'migrate' subcommand
    is_migrate_command = len(sys.argv) > 1 and sys.argv[1] == 'migrate'
    if is_migrate_command:
        try:
            from credential_vault import get_migration_database_credentials
            DB_USER, DB_PASSWORD = get_migration_database_credentials()
        except (RuntimeError, ImportError) as e:
            raise RuntimeError(f"Database migration aborted: {e}") from None

    # Base MySQL connection options
    db_options = {
        'charset': 'utf8mb4',
        'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
    }

    # Optional TLS options for remote MySQL / TiDB Cloud
    db_ssl_mode = os.getenv('DB_SSL_MODE')
    db_ssl_ca = os.getenv('DB_SSL_CA')
    if db_ssl_mode:
        db_options['ssl_mode'] = db_ssl_mode
    if db_ssl_ca:
        db_options['ssl'] = {'ca': db_ssl_ca}

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': DB_NAME,
            'USER': DB_USER,
            'PASSWORD': DB_PASSWORD,
            'HOST': DB_HOST,
            'PORT': DB_PORT,
            'OPTIONS': db_options,
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

