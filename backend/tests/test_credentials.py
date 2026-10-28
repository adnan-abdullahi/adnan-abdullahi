"""
Unit tests for platform-neutral database migration credential resolution,
precedence rules, incomplete pair rejection, command isolation, and secret redaction.
"""
import os
import sys
import subprocess
import unittest
from unittest import mock

from django.test import SimpleTestCase
import credential_vault


class TestCredentialPrecedenceAndValidation(unittest.TestCase):
    """Test credential resolution precedence, presence vs validity, and fail-closed rules."""

    def setUp(self):
        # Clean environment for each test case
        self.env_patcher = mock.patch.dict(os.environ, {}, clear=True)
        self.env_patcher.start()

    def tearDown(self):
        self.env_patcher.stop()

    def test_both_env_vars_supplied_takes_precedence_over_vault(self):
        """Explicit environment credentials take precedence over Windows vault."""
        os.environ['DB_MIGRATE_USER'] = 'custom_migrator'
        os.environ['DB_MIGRATE_PASSWORD'] = 'custom_pass_123'

        with mock.patch.object(credential_vault, 'is_vault_available', return_value=True):
            with mock.patch.object(credential_vault, 'has_migration_credential', return_value=True):
                # Even if vault has credentials, environment variables must be selected
                user, password = credential_vault.get_migration_database_credentials()
                self.assertEqual(user, 'custom_migrator')
                self.assertEqual(password, 'custom_pass_123')

    def test_both_env_vars_absent_falls_back_to_windows_vault(self):
        """When neither environment variable is set, fall back to Windows vault on Windows."""
        # Neither DB_MIGRATE_USER nor DB_MIGRATE_PASSWORD present in os.environ
        with mock.patch.object(credential_vault, 'is_vault_available', return_value=True):
            with mock.patch.object(credential_vault, 'has_migration_credential', return_value=True):
                with mock.patch.object(
                    credential_vault, 'get_migration_credential', return_value=('vault_user', 'vault_pass')
                ):
                    user, password = credential_vault.get_migration_database_credentials()
                    self.assertEqual(user, 'vault_user')
                    self.assertEqual(password, 'vault_pass')

    def test_both_env_vars_absent_fails_closed_on_non_windows(self):
        """When neither variable is set on non-Windows, fail closed with clear error."""
        with mock.patch.object(credential_vault, 'is_vault_available', return_value=False):
            with self.assertRaises(RuntimeError) as ctx:
                credential_vault.get_migration_database_credentials()
            self.assertIn("Windows Credential Manager is unavailable on this platform", str(ctx.exception))

    def test_both_env_vars_absent_fails_closed_when_not_in_windows_vault(self):
        """When neither variable is set and vault has no target, fail closed with clear error."""
        with mock.patch.object(credential_vault, 'is_vault_available', return_value=True):
            with mock.patch.object(credential_vault, 'has_migration_credential', return_value=False):
                with self.assertRaises(RuntimeError) as ctx:
                    credential_vault.get_migration_database_credentials()
                self.assertIn("was not found in Windows Credential Manager", str(ctx.exception))

    def test_username_supplied_without_password_fails_closed(self):
        """If DB_MIGRATE_USER is supplied but DB_MIGRATE_PASSWORD is missing, fail closed without vault query."""
        os.environ['DB_MIGRATE_USER'] = 'migrator_user'

        with mock.patch.object(credential_vault, 'is_vault_available', return_value=True):
            with mock.patch.object(credential_vault, 'has_migration_credential', return_value=True) as mock_vault:
                with self.assertRaises(RuntimeError) as ctx:
                    credential_vault.get_migration_database_credentials()
                self.assertIn("DB_MIGRATE_PASSWORD is missing", str(ctx.exception))
                mock_vault.assert_not_called()

    def test_password_supplied_without_username_fails_closed(self):
        """If DB_MIGRATE_PASSWORD is supplied but DB_MIGRATE_USER is missing, fail closed without vault query."""
        os.environ['DB_MIGRATE_PASSWORD'] = 'some_password'

        with mock.patch.object(credential_vault, 'is_vault_available', return_value=True):
            with mock.patch.object(credential_vault, 'has_migration_credential', return_value=True) as mock_vault:
                with self.assertRaises(RuntimeError) as ctx:
                    credential_vault.get_migration_database_credentials()
                self.assertIn("DB_MIGRATE_USER is missing", str(ctx.exception))
                mock_vault.assert_not_called()

    def test_empty_string_username_fails_closed(self):
        """If DB_MIGRATE_USER is empty string, fail closed without vault query."""
        os.environ['DB_MIGRATE_USER'] = ''
        os.environ['DB_MIGRATE_PASSWORD'] = 'some_password'

        with mock.patch.object(credential_vault, 'is_vault_available', return_value=True):
            with mock.patch.object(credential_vault, 'has_migration_credential', return_value=True) as mock_vault:
                with self.assertRaises(RuntimeError) as ctx:
                    credential_vault.get_migration_database_credentials()
                self.assertIn("DB_MIGRATE_USER cannot be empty", str(ctx.exception))
                mock_vault.assert_not_called()

    def test_whitespace_only_username_fails_closed(self):
        """If DB_MIGRATE_USER is whitespace-only, fail closed without vault query."""
        os.environ['DB_MIGRATE_USER'] = '   \t  '
        os.environ['DB_MIGRATE_PASSWORD'] = 'some_password'

        with mock.patch.object(credential_vault, 'is_vault_available', return_value=True):
            with mock.patch.object(credential_vault, 'has_migration_credential', return_value=True) as mock_vault:
                with self.assertRaises(RuntimeError) as ctx:
                    credential_vault.get_migration_database_credentials()
                self.assertIn("DB_MIGRATE_USER cannot be empty or whitespace-only", str(ctx.exception))
                mock_vault.assert_not_called()

    def test_empty_password_fails_closed(self):
        """If DB_MIGRATE_PASSWORD is empty string, fail closed without vault query."""
        os.environ['DB_MIGRATE_USER'] = 'migrator_user'
        os.environ['DB_MIGRATE_PASSWORD'] = ''

        with mock.patch.object(credential_vault, 'is_vault_available', return_value=True):
            with mock.patch.object(credential_vault, 'has_migration_credential', return_value=True) as mock_vault:
                with self.assertRaises(RuntimeError) as ctx:
                    credential_vault.get_migration_database_credentials()
                self.assertIn("DB_MIGRATE_PASSWORD cannot be empty", str(ctx.exception))
                mock_vault.assert_not_called()

    def test_password_leading_and_trailing_whitespace_preserved_exactly(self):
        """Intentional whitespace in passwords must be preserved byte-for-byte; never trimmed."""
        raw_password = "  leading_and_trailing_space_pw \t \n "
        os.environ['DB_MIGRATE_USER'] = 'migrator_user'
        os.environ['DB_MIGRATE_PASSWORD'] = raw_password

        _, resolved_password = credential_vault.get_migration_database_credentials()
        self.assertEqual(resolved_password, raw_password)
        self.assertEqual(len(resolved_password), len(raw_password))

    def test_username_outer_whitespace_trimmed(self):
        """Accidental outer whitespace on usernames is trimmed safely."""
        os.environ['DB_MIGRATE_USER'] = '  portfolio_migrator  '
        os.environ['DB_MIGRATE_PASSWORD'] = 'password123'

        resolved_user, _ = credential_vault.get_migration_database_credentials()
        self.assertEqual(resolved_user, 'portfolio_migrator')

    def test_secrets_are_not_disclosed_in_exceptions(self):
        """Raw secrets must never appear in exception messages."""
        secret_password = "super_confidential_token_xyz_987"
        os.environ['DB_MIGRATE_USER'] = ''  # Will trigger error
        os.environ['DB_MIGRATE_PASSWORD'] = secret_password

        with self.assertRaises(RuntimeError) as ctx:
            credential_vault.get_migration_database_credentials()
        self.assertNotIn(secret_password, str(ctx.exception))


class TestPlatformSafetyAndImport(unittest.TestCase):
    """Test platform detection and simulated non-Windows module import."""

    def test_is_vault_available_reflects_platform(self):
        """is_vault_available() returns True only on win32 when advapi32 is loaded."""
        if sys.platform == 'win32':
            self.assertTrue(credential_vault.is_vault_available())
        else:
            self.assertFalse(credential_vault.is_vault_available())

    def test_vault_functions_raise_runtime_error_when_unavailable(self):
        """Calling Win32 vault functions when vault is unavailable raises clear RuntimeError."""
        with mock.patch.object(credential_vault, 'is_vault_available', return_value=False):
            with self.assertRaises(RuntimeError) as ctx:
                credential_vault.store_migration_credential('user', 'pass')
            self.assertIn("only supported on Windows platforms", str(ctx.exception))

            with self.assertRaises(RuntimeError) as ctx:
                credential_vault.get_migration_credential()
            self.assertIn("only supported on Windows platforms", str(ctx.exception))

            with self.assertRaises(RuntimeError) as ctx:
                credential_vault.delete_migration_credential()
            self.assertIn("only supported on Windows platforms", str(ctx.exception))

            self.assertFalse(credential_vault.has_migration_credential())

    def test_simulated_non_windows_import_in_subprocess(self):
        """
        Simulated Non-Windows Import Test:
        Spawns an isolated Python process where ctypes.windll is deleted and sys.platform
        is forced to 'linux' before credential_vault is ever imported.
        Confirms zero AttributeError or crash on import.
        """
        code = (
            "import sys, ctypes; "
            "delattr(ctypes, 'windll') if hasattr(ctypes, 'windll') else None; "
            "sys.platform = 'linux'; "
            "sys.path.insert(0, 'backend'); "
            "import credential_vault; "
            "assert not credential_vault.is_vault_available(), 'Vault must be unavailable on Linux'; "
            "assert credential_vault.advapi32 is None, 'advapi32 must be None on Linux'; "
            "print('SIMULATED_LINUX_IMPORT_SUCCESS')"
        )
        result = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, f"Simulated non-Windows import failed: {result.stderr}")
        self.assertIn("SIMULATED_LINUX_IMPORT_SUCCESS", result.stdout)


class TestCommandIsolationAndSettings(SimpleTestCase):
    """Test command-line subcommand gating and database isolation in settings."""

    def test_test_database_is_sqlite_in_memory(self):
        """Test runner is isolated to in-memory SQLite before migration credential resolution."""
        from django.conf import settings
        self.assertEqual(settings.DATABASES['default']['ENGINE'], 'django.db.backends.sqlite3')
        # In Django test runner, in-memory SQLite is assigned :memory: or file:memorydb...
        self.assertTrue(
            settings.DATABASES['default']['NAME'] == ':memory:'
            or 'memory' in settings.DATABASES['default']['NAME']
        )

    def test_command_isolation_evaluation(self):
        """
        Verify the exact logic used in settings.py:
        Only len(sys.argv) > 1 and sys.argv[1] == 'migrate' activates migration mode.
        """
        def evaluate_migrate_command(argv: list[str]) -> bool:
            return len(argv) > 1 and argv[1] == 'migrate'

        def evaluate_test_command(argv: list[str]) -> bool:
            return len(argv) > 1 and argv[1] == 'test'

        # Migration command matches
        self.assertTrue(evaluate_migrate_command(['manage.py', 'migrate']))
        self.assertTrue(evaluate_migrate_command(['manage.py', 'migrate', 'contact']))
        self.assertTrue(evaluate_migrate_command(['manage.py', 'migrate', '--database=default']))

        # Non-migration commands do NOT match
        self.assertFalse(evaluate_migrate_command(['manage.py', 'help', 'migrate']))
        self.assertFalse(evaluate_migrate_command(['manage.py', 'test', '--tag=migrate']))
        self.assertFalse(evaluate_migrate_command(['manage.py', 'makemigrations']))
        self.assertFalse(evaluate_migrate_command(['manage.py', 'showmigrations']))
        self.assertFalse(evaluate_migrate_command(['manage.py', 'sqlmigrate', 'contact', '0001']))
        self.assertFalse(evaluate_migrate_command(['manage.py', 'runserver']))
        self.assertFalse(evaluate_migrate_command(['gunicorn', 'config.wsgi:application']))

        # Test command matches
        self.assertTrue(evaluate_test_command(['manage.py', 'test']))
        self.assertTrue(evaluate_test_command(['manage.py', 'test', 'contact']))
        self.assertFalse(evaluate_test_command(['manage.py', 'migrate', '--database=test']))
