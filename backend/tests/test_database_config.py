"""
Unit tests for database driver registration, cross-platform PyMySQL compatibility,
fail-closed remote TLS guards, CA bundle path verification, and absence of mysqlclient C keywords.
Conforms strictly to Stage 3.2D requirements.
"""
import os
import ssl
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from config.settings import (
    BASE_DIR,
    LOCAL_DATABASE_HOSTS,
    build_database_config,
    is_local_database_host,
)


class TestDatabaseDriverRegistration(unittest.TestCase):
    """Verify PyMySQL is registered as MySQLdb and meets Django requirements."""

    def test_pymysql_registered_in_sys_modules(self):
        """Verify that MySQLdb is registered in sys.modules and aliases pymysql."""
        import pymysql
        import MySQLdb

        self.assertIn('MySQLdb', sys.modules)
        self.assertIs(sys.modules['MySQLdb'], pymysql)
        self.assertIs(MySQLdb, pymysql)

    def test_pymysql_version_info_satisfies_django(self):
        """Verify that version_info is set to satisfy Django's version check."""
        import MySQLdb

        self.assertTrue(hasattr(MySQLdb, 'version_info'))
        self.assertGreaterEqual(MySQLdb.version_info, (1, 4, 3))
        self.assertEqual(MySQLdb.version_info, (2, 2, 1, 'final', 0))

    def test_django_mysql_engine_imports_pymysql(self):
        """Verify Django's MySQL backend Database object points to MySQLdb (PyMySQL)."""
        import MySQLdb
        from django.db.backends.mysql.base import Database

        self.assertIs(Database, MySQLdb)


class TestHostClassification(unittest.TestCase):
    """Verify host classification strictly distinguishes local loopback from remote hosts."""

    def test_canonical_local_hosts_classified_as_local(self):
        """Verify 127.0.0.1, localhost, and ::1 are recognized as local."""
        for host in ('127.0.0.1', 'localhost', '::1', 'LOCALHOST', ' 127.0.0.1 '):
            self.assertTrue(
                is_local_database_host(host),
                f"Expected {host!r} to be classified as a local loopback host"
            )

    def test_default_empty_host_classified_as_local(self):
        """Empty or None host defaults to local 127.0.0.1."""
        self.assertTrue(is_local_database_host(''))
        self.assertTrue(is_local_database_host(None))

    def test_remote_hosts_classified_as_remote(self):
        """Verify TiDB gateway, remote IPs, and lookalike domains are classified as remote."""
        remote_hosts = (
            'gateway01.eu-central-1.prod.aws.tidbcloud.com',
            '192.168.1.100',
            '10.0.0.5',
            'localhost.evil.com',
            '127.0.0.2',
            'db.internal',
        )
        for host in remote_hosts:
            self.assertFalse(
                is_local_database_host(host),
                f"Expected {host!r} to be classified as remote"
            )


class TestFailClosedRemoteDatabaseTls(unittest.TestCase):
    """
    Verify fail-closed remote database TLS configuration using the actual
    build_database_config function from config.settings.
    """

    def setUp(self):
        # Create a real temporary CA certificate file for valid path tests
        self.temp_ca = tempfile.NamedTemporaryFile(suffix='.pem', delete=False)
        self.temp_ca.write(b"-----BEGIN CERTIFICATE-----\nFAKE\n-----END CERTIFICATE-----\n")
        self.temp_ca.close()
        self.valid_ca_path = self.temp_ca.name

    def tearDown(self):
        try:
            os.unlink(self.valid_ca_path)
        except OSError:
            pass

    # 1. Remote host with valid CA path and VERIFY_IDENTITY
    def test_remote_host_with_valid_ca_and_verify_identity_succeeds(self):
        """Remote host with an existing CA path and DB_SSL_MODE=VERIFY_IDENTITY configures TLS."""
        env = {
            'DB_HOST': 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
            'DB_SSL_CA': self.valid_ca_path,
            'DB_SSL_MODE': 'VERIFY_IDENTITY',
        }
        config = build_database_config(env=env)
        opts = config['default']['OPTIONS']

        self.assertIn('ssl', opts)
        self.assertEqual(opts['ssl']['ca'], self.valid_ca_path)
        self.assertTrue(opts['ssl']['check_hostname'])
        self.assertNotIn('ssl_mode', opts)

    # 2. Remote host with missing CA path
    def test_remote_host_with_missing_ca_path_fails_closed(self):
        """Remote host with missing or empty DB_SSL_CA raises RuntimeError (fail-closed)."""
        for empty_ca in ('', '   ', None):
            env = {
                'DB_HOST': 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
                'DB_SSL_MODE': 'VERIFY_IDENTITY',
            }
            if empty_ca is not None:
                env['DB_SSL_CA'] = empty_ca
            with self.assertRaises(RuntimeError) as cm:
                build_database_config(env=env)
            self.assertIn("DB_SSL_CA is required for remote database connections", str(cm.exception))
            self.assertIn("Plaintext remote database connections are strictly prohibited", str(cm.exception))

    # 3. Remote host with invalid CA path
    def test_remote_host_with_invalid_ca_path_fails_closed(self):
        """Remote host with nonexistent DB_SSL_CA path raises RuntimeError during initialization."""
        nonexistent_path = '/nonexistent/path/to/ca_bundle.crt'
        env = {
            'DB_HOST': 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
            'DB_SSL_CA': nonexistent_path,
            'DB_SSL_MODE': 'VERIFY_IDENTITY',
        }
        with self.assertRaises(RuntimeError) as cm:
            build_database_config(env=env)
        self.assertIn("Configured DB_SSL_CA certificate file not found", str(cm.exception))

    # 4. Remote host with missing SSL mode
    def test_remote_host_with_missing_ssl_mode_defaults_to_verify_identity(self):
        """Omitting DB_SSL_MODE on remote host defaults to VERIFY_IDENTITY without weakening TLS."""
        for missing_mode in ('', '   ', None):
            env = {
                'DB_HOST': 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
                'DB_SSL_CA': self.valid_ca_path,
            }
            if missing_mode is not None:
                env['DB_SSL_MODE'] = missing_mode
            config = build_database_config(env=env)
            opts = config['default']['OPTIONS']

            self.assertIn('ssl', opts)
            self.assertTrue(opts['ssl']['check_hostname'])
            self.assertEqual(opts['ssl']['ca'], self.valid_ca_path)
            self.assertNotIn('ssl_mode', opts)

    # 5. Remote host with an unsupported SSL mode
    def test_remote_host_with_unsupported_ssl_mode_fails_closed(self):
        """Unsupported DB_SSL_MODE values (e.g. 'FOOBAR', 'CUSTOM') raise RuntimeError."""
        env = {
            'DB_HOST': 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
            'DB_SSL_CA': self.valid_ca_path,
            'DB_SSL_MODE': 'FOOBAR',
        }
        with self.assertRaises(RuntimeError) as cm:
            build_database_config(env=env)
        self.assertIn("Unsupported or insecure DB_SSL_MODE", str(cm.exception))
        self.assertIn("strictly require DB_SSL_MODE='VERIFY_IDENTITY'", str(cm.exception))

    # 6. Remote host with explicitly weaker verification modes
    def test_remote_host_with_weaker_ssl_modes_fails_closed(self):
        """Weaker verification modes (VERIFY_CA, REQUIRED, DISABLED) are strictly rejected on remote hosts."""
        for weaker_mode in ('VERIFY_CA', 'REQUIRED', 'DISABLED', 'PREFERRED'):
            env = {
                'DB_HOST': 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
                'DB_SSL_CA': self.valid_ca_path,
                'DB_SSL_MODE': weaker_mode,
            }
            with self.assertRaises(RuntimeError) as cm:
                build_database_config(env=env)
            self.assertIn("Unsupported or insecure DB_SSL_MODE", str(cm.exception))

    # 7. Local development configuration
    def test_local_development_baseline_without_ca(self):
        """Localhost connection without CA succeeds with unencrypted baseline options."""
        env = {
            'DB_HOST': '127.0.0.1',
            'DB_NAME': 'portfolio_db',
            'DB_USER': 'portfolio_user',
        }
        config = build_database_config(env=env)
        opts = config['default']['OPTIONS']

        self.assertNotIn('ssl', opts)
        self.assertNotIn('ssl_mode', opts)
        self.assertEqual(opts['charset'], 'utf8mb4')

    # 8. Render system CA bundle path integration
    def test_render_system_ca_bundle_path_when_file_exists(self):
        """Verify /etc/ssl/certs/ca-certificates.crt is accepted when present on filesystem."""
        env = {
            'DB_HOST': 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
            'DB_SSL_CA': '/etc/ssl/certs/ca-certificates.crt',
            'DB_SSL_MODE': 'VERIFY_IDENTITY',
        }
        with mock.patch.object(Path, 'is_file', return_value=True):
            config = build_database_config(env=env)
            opts = config['default']['OPTIONS']

            self.assertIn('ssl', opts)
            self.assertEqual(opts['ssl']['ca'], '/etc/ssl/certs/ca-certificates.crt')
            self.assertTrue(opts['ssl']['check_hostname'])
            self.assertNotIn('ssl_mode', opts)

    # 9. Absence of native ssl_mode argument across all valid configurations
    def test_absence_of_native_ssl_mode_argument(self):
        """Ensure native mysqlclient 'ssl_mode' keyword is never passed to PyMySQL."""
        env = {
            'DB_HOST': 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
            'DB_SSL_CA': self.valid_ca_path,
            'DB_SSL_MODE': 'VERIFY_IDENTITY',
        }
        config = build_database_config(env=env)
        self.assertNotIn('ssl_mode', config['default']['OPTIONS'])

    # 10. SSL context verification semantics
    def test_ssl_context_enforces_cert_required_and_check_hostname(self):
        """Verify PyMySQL Connection._create_ssl_ctx enforces CERT_REQUIRED and check_hostname."""
        from pymysql.connections import Connection

        real_ca_path = BASE_DIR / 'certs' / 'isrgrootx1.pem'
        self.assertTrue(real_ca_path.is_file(), "Expected real ISRG Root X1 certificate for SSL context test")

        conn = Connection.__new__(Connection)
        sslp = {
            'ca': str(real_ca_path),
            'check_hostname': True,
        }
        ctx = conn._create_ssl_ctx(sslp)

        self.assertIsInstance(ctx, ssl.SSLContext)
        self.assertEqual(ctx.verify_mode, ssl.CERT_REQUIRED)
        self.assertTrue(ctx.check_hostname)
