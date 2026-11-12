"""
Django settings for portfolio backend contact service.
Loads runtime settings from backend/.env.
Integrates universal PyMySQL driver, least-privilege runtime MySQL connection (portfolio_user)
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

# Cloudflare Origin Secret Configuration (Origin Protection)
CF_ORIGIN_SECRET = os.getenv('CF_ORIGIN_SECRET', '').strip()

# Application definition
INSTALLED_APPS = [
    'rest_framework',
    'corsheaders',
    'contact.apps.ContactConfig',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'contact.middleware.CloudflareOriginSecretMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
]

ROOT_URLCONF = 'config.urls'

WSGI_APPLICATION = 'config.wsgi.application'
ASGI_APPLICATION = 'config.asgi.application'

# Database Configuration

# Canonical local loopback host definitions (IPv4, IPv6, localhost hostname)
LOCAL_DATABASE_HOSTS = frozenset({'127.0.0.1', 'localhost', '::1'})


def is_local_database_host(host: str) -> bool:
    """
    Return True if the specified database host is a recognized local loopback address.

    Canonical local loopback addresses:
    - '127.0.0.1': Standard IPv4 loopback address (RFC 5735). Default local development address.
    - 'localhost': Standard loopback domain name (RFC 6761).
    - '::1': Standard IPv6 loopback address (RFC 4291).

    All other hostnames and IP addresses are strictly classified as remote and require TLS.
    """
    if not host:
        return True  # Default '127.0.0.1' is local
    return host.strip().lower() in LOCAL_DATABASE_HOSTS


def build_database_config(env=None, base_dir=None, is_migrate=False) -> dict:
    """
    Construct the database configuration dictionary with fail-closed TLS guards for remote hosts.

    Security Invariants:
    1. Local hosts ('127.0.0.1', 'localhost', '::1') permit unencrypted connections for local dev.
    2. Remote hosts strictly require an explicit, existing CA certificate path (DB_SSL_CA).
    3. Remote hosts strictly require DB_SSL_MODE='VERIFY_IDENTITY' (or omitted, defaulting to VERIFY_IDENTITY).
       Any weaker mode (e.g. 'VERIFY_CA', 'REQUIRED', 'DISABLED') or unsupported mode is rejected.
    4. TLS options configure PyMySQL via 'ssl': {'ca': ..., 'check_hostname': True}.
       The native mysqlclient 'ssl_mode' keyword is never passed.
    """
    if env is None:
        env = os.environ
    if base_dir is None:
        base_dir = BASE_DIR

    db_name = env.get('DB_NAME', 'portfolio_db')
    db_user = env.get('DB_USER', 'portfolio_user')
    db_password = env.get('DB_PASSWORD', '')
    db_host = env.get('DB_HOST', '127.0.0.1')
    db_port = env.get('DB_PORT', '3306')

    if is_migrate:
        try:
            from credential_vault import get_migration_database_credentials
            db_user, db_password = get_migration_database_credentials()
        except (RuntimeError, ImportError) as e:
            raise RuntimeError(f"Database migration aborted: {e}") from None

    db_options = {
        'charset': 'utf8mb4',
        'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
    }

    db_ssl_ca = env.get('DB_SSL_CA', '').strip()
    db_ssl_mode = env.get('DB_SSL_MODE', '').strip()

    is_local = is_local_database_host(db_host)

    if not is_local:
        # Remote database connection: Fail-closed security validation
        if not db_ssl_ca:
            raise RuntimeError(
                f"DB_SSL_CA is required for remote database connections (DB_HOST={db_host!r}). "
                "Plaintext remote database connections are strictly prohibited."
            )

        db_ssl_ca_str = db_ssl_ca.strip()
        is_rooted = (
            db_ssl_ca_str.startswith('/')
            or db_ssl_ca_str.startswith('\\')
            or Path(db_ssl_ca_str).is_absolute()
        )
        if is_rooted:
            ca_path = Path(db_ssl_ca_str)
            ca_output = ca_path.as_posix() if db_ssl_ca_str.startswith('/') else str(ca_path)
        else:
            ca_path = base_dir / db_ssl_ca_str
            ca_output = str(ca_path)

        if not ca_path.is_file():
            raise RuntimeError(
                f"Configured DB_SSL_CA certificate file not found: {db_ssl_ca} "
                f"(resolved to {ca_path}). A valid existing CA bundle is required for remote connections."
            )

        # Enforce supported TLS mode for remote database
        # Default when omitted is VERIFY_IDENTITY (fail-secure default)
        normalized_mode = (db_ssl_mode or 'VERIFY_IDENTITY').upper()
        if normalized_mode != 'VERIFY_IDENTITY':
            raise RuntimeError(
                f"Unsupported or insecure DB_SSL_MODE={db_ssl_mode!r} for remote database host. "
                "Remote database connections strictly require DB_SSL_MODE='VERIFY_IDENTITY'. "
                "Weaker or unverified SSL modes are prohibited."
            )

        db_options['ssl'] = {
            'ca': ca_output,
            'check_hostname': True,
        }
    else:
        # Local development database connection
        if db_ssl_ca:
            db_ssl_ca_str = db_ssl_ca.strip()
            is_rooted = (
                db_ssl_ca_str.startswith('/')
                or db_ssl_ca_str.startswith('\\')
                or Path(db_ssl_ca_str).is_absolute()
            )
            if is_rooted:
                ca_path = Path(db_ssl_ca_str)
                ca_output = ca_path.as_posix() if db_ssl_ca_str.startswith('/') else str(ca_path)
            else:
                ca_path = base_dir / db_ssl_ca_str
                ca_output = str(ca_path)

            if not ca_path.is_file():
                raise RuntimeError(
                    f"Configured DB_SSL_CA certificate file not found: {db_ssl_ca} "
                    f"(resolved to {ca_path})."
                )
            normalized_mode = (db_ssl_mode or 'VERIFY_IDENTITY').upper()
            if normalized_mode != 'VERIFY_IDENTITY':
                raise RuntimeError(
                    f"Unsupported DB_SSL_MODE={db_ssl_mode!r}. Only 'VERIFY_IDENTITY' is supported."
                )
            db_options['ssl'] = {
                'ca': ca_output,
                'check_hostname': True,
            }

    return {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': db_name,
            'USER': db_user,
            'PASSWORD': db_password,
            'HOST': db_host,
            'PORT': db_port,
            'OPTIONS': db_options,
        }
    }


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
    # 2. Runtime / Migration baseline
    is_migrate_command = len(sys.argv) > 1 and sys.argv[1] == 'migrate'
    DATABASES = build_database_config(is_migrate=is_migrate_command)

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

# Contact Email Notification Configuration (Resend HTTPS API)
# Uses environment variables: RESEND_API_KEY, CONTACT_NOTIFICATION_TO, CONTACT_NOTIFICATION_FROM
# No hardcoded credentials or personal email addresses. Does not use SMTP.
RESEND_API_KEY = os.getenv('RESEND_API_KEY', '').strip()
CONTACT_NOTIFICATION_TO = os.getenv('CONTACT_NOTIFICATION_TO', '').strip()
CONTACT_NOTIFICATION_FROM = os.getenv('CONTACT_NOTIFICATION_FROM', '').strip()
EMAIL_SIMULATION_ALLOWED = os.getenv('EMAIL_SIMULATION_ALLOWED', 'False').lower() in ('true', '1')

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

