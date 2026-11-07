# Config package
import sys

# On Windows, substitute MySQLdb with pure-Python PyMySQL using Python's OpenSSL
# to bypass the MariaDB Connector/C Schannel TLS 1.3 decryption defect (0x80090330).
if sys.platform == 'win32':
    try:
        import pymysql
    except ImportError as e:
        raise RuntimeError(
            "PyMySQL is required for local Windows development to connect to TiDB Cloud "
            "due to Windows Schannel TLS 1.3 incompatibilities with native mysqlclient. "
            "Please install it in your virtual environment: pip install \"pymysql>=1.1.1,<2.0\""
        ) from e

    pymysql.version_info = (2, 2, 1, 'final', 0)
    pymysql.install_as_MySQLdb()

