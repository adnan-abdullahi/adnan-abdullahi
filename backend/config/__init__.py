# Config package
"""
Database driver initialization.
Substitutes MySQLdb with pure-Python PyMySQL across all platforms (Windows and Linux)
using Python's OpenSSL to ensure platform portability, eliminate native C-extension
dependencies (mysqlclient), and support TLS 1.3 verification with TiDB Cloud.
"""
try:
    import pymysql
except ImportError as e:
    raise RuntimeError(
        "PyMySQL is required to connect to the database. "
        "Please install it in your virtual environment: pip install \"pymysql>=1.1.1,<2.0\""
    ) from e

pymysql.version_info = (2, 2, 1, 'final', 0)
pymysql.install_as_MySQLdb()


