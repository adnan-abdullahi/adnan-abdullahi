"""
Credential Vault utility for database migration credentials.
Supports native Windows Credential Manager (advapi32.dll) on Windows,
and platform-neutral environment variable resolution for Linux/container environments.
Zero secrets are stored in this file.
"""
import os
import sys
import ctypes

IS_WINDOWS = sys.platform == 'win32'

if IS_WINDOWS:
    from ctypes import wintypes
    advapi32 = ctypes.windll.advapi32

    CRED_TYPE_GENERIC = 1
    CRED_PERSIST_LOCAL_MACHINE = 2

    class CREDENTIAL(ctypes.Structure):
        _fields_ = [
            ('Flags', wintypes.DWORD),
            ('Type', wintypes.DWORD),
            ('TargetName', wintypes.LPWSTR),
            ('Comment', wintypes.LPWSTR),
            ('LastWritten', wintypes.FILETIME),
            ('CredentialBlobSize', wintypes.DWORD),
            ('CredentialBlob', ctypes.c_void_p),
            ('Persist', wintypes.DWORD),
            ('AttributeCount', wintypes.DWORD),
            ('Attributes', ctypes.c_void_p),
            ('TargetAlias', wintypes.LPWSTR),
            ('UserName', wintypes.LPWSTR),
        ]

    PCREDENTIAL = ctypes.POINTER(CREDENTIAL)

    CredWriteW = advapi32.CredWriteW
    CredWriteW.argtypes = [PCREDENTIAL, wintypes.DWORD]
    CredWriteW.restype = wintypes.BOOL

    CredReadW = advapi32.CredReadW
    CredReadW.argtypes = [wintypes.LPCWSTR, wintypes.DWORD, wintypes.DWORD, ctypes.POINTER(PCREDENTIAL)]
    CredReadW.restype = wintypes.BOOL

    CredFree = advapi32.CredFree
    CredFree.argtypes = [ctypes.c_void_p]
    CredFree.restype = None

    CredDeleteW = advapi32.CredDeleteW
    CredDeleteW.argtypes = [wintypes.LPCWSTR, wintypes.DWORD, wintypes.DWORD]
    CredDeleteW.restype = wintypes.BOOL
else:
    advapi32 = None

DEFAULT_TARGET = "portfolio_db_migrator"

def is_vault_available() -> bool:
    """Return True if running on Windows and native advapi32 Credential Manager is accessible."""
    return IS_WINDOWS and advapi32 is not None

def store_migration_credential(username: str, password: str, target: str = DEFAULT_TARGET) -> None:
    """Store migration credential in Windows Credential Manager without exposing to disk or env."""
    if not is_vault_available():
        raise RuntimeError("Windows Credential Manager is only supported on Windows platforms.")
    raw_bytes = password.encode('utf-8')
    blob_buf = ctypes.create_string_buffer(raw_bytes, len(raw_bytes))
    cred = CREDENTIAL()
    cred.Flags = 0
    cred.Type = CRED_TYPE_GENERIC
    cred.TargetName = target
    cred.Comment = "Portfolio Database Migration Account"
    cred.CredentialBlobSize = len(raw_bytes)
    cred.CredentialBlob = ctypes.cast(blob_buf, ctypes.c_void_p)
    cred.Persist = CRED_PERSIST_LOCAL_MACHINE
    cred.AttributeCount = 0
    cred.Attributes = None
    cred.TargetAlias = None
    cred.UserName = username
    if not CredWriteW(ctypes.byref(cred), 0):
        err = ctypes.GetLastError()
        raise RuntimeError(f"CredWriteW failed with error code: {err}")

def decode_credential_blob(blob: bytes) -> str:
    """
    Safely decode a credential secret blob retrieved from Windows Credential Manager.

    Windows Credential Manager entries created via the Windows GUI (Control Panel
    Credential Manager) or standard Win32 applets store generic credential secrets as
    UTF-16LE (wide characters). Entries created programmatically via Python or POSIX
    tools typically store UTF-8 bytes.

    Decoding strategy:
    1. If the blob is empty, raise RuntimeError (fail closed).
    2. Check for explicit Byte Order Marks (UTF-16 LE/BE or UTF-8 BOM).
    3. If null bytes (b'\\x00') are present, the blob represents wide characters
       (UTF-16LE). Decode using 'utf-16le'. Strip a single trailing C-style null
       character if present.
    4. If no null bytes are present, decode strictly using 'utf-8'.
    5. Validate that the decoded password is non-empty and contains no embedded
       null characters.
    6. Fail closed with RuntimeError if decoding fails or produces invalid content,
       without disclosing secret contents.
    """
    if not blob:
        raise RuntimeError("Credential decoding failed: credential secret blob is empty.")

    # 1. Check for explicit Byte Order Marks
    if blob.startswith(b'\xff\xfe') or blob.startswith(b'\xfe\xff'):
        try:
            decoded = blob.decode('utf-16')
        except UnicodeDecodeError:
            raise RuntimeError("Credential decoding failed: invalid UTF-16 byte sequence.") from None
    elif blob.startswith(b'\xef\xbb\xbf'):
        try:
            decoded = blob.decode('utf-8-sig')
        except UnicodeDecodeError:
            raise RuntimeError("Credential decoding failed: invalid UTF-8 byte sequence.") from None
    # 2. Null bytes indicate wide-character (UTF-16LE) encoding from Windows Credential Manager
    elif b'\x00' in blob:
        try:
            decoded = blob.decode('utf-16le')
        except UnicodeDecodeError:
            raise RuntimeError("Credential decoding failed: invalid UTF-16LE byte sequence.") from None
    # 3. No null bytes: standard UTF-8 encoding
    else:
        try:
            decoded = blob.decode('utf-8')
        except UnicodeDecodeError:
            raise RuntimeError("Credential decoding failed: invalid UTF-8 byte sequence.") from None

    # Strip single trailing C-style null terminator if present
    if decoded.endswith('\x00'):
        decoded = decoded[:-1]

    # Reject passwords with embedded null characters
    if '\x00' in decoded:
        raise RuntimeError("Credential decoding failed: decoded password contains embedded null characters.")

    if not decoded:
        raise RuntimeError("Credential decoding failed: decoded password is empty.")

    return decoded

def get_migration_credential(target: str = DEFAULT_TARGET) -> tuple[str, str]:
    """Retrieve migration (username, password) tuple from Windows Credential Manager."""
    if not is_vault_available():
        raise RuntimeError("Windows Credential Manager is only supported on Windows platforms.")
    p_cred = PCREDENTIAL()
    if not CredReadW(target, CRED_TYPE_GENERIC, 0, ctypes.byref(p_cred)):
        err = ctypes.GetLastError()
        raise RuntimeError(f"CredReadW failed for target '{target}' with error code: {err}")
    cred = p_cred.contents
    username = cred.UserName
    try:
        blob = ctypes.string_at(cred.CredentialBlob, cred.CredentialBlobSize)
        password = decode_credential_blob(blob)
    finally:
        CredFree(p_cred)
    return username, password

def has_migration_credential(target: str = DEFAULT_TARGET) -> bool:
    """Check if migration credential exists in Windows Credential Manager."""
    if not is_vault_available():
        return False
    p_cred = PCREDENTIAL()
    if CredReadW(target, CRED_TYPE_GENERIC, 0, ctypes.byref(p_cred)):
        CredFree(p_cred)
        return True
    return False

def delete_migration_credential(target: str = DEFAULT_TARGET) -> None:
    """Delete migration credential from Windows Credential Manager."""
    if not is_vault_available():
        raise RuntimeError("Windows Credential Manager is only supported on Windows platforms.")
    if not CredDeleteW(target, CRED_TYPE_GENERIC, 0):
        err = ctypes.GetLastError()
        raise RuntimeError(f"CredDeleteW failed with error code: {err}")

def get_migration_database_credentials() -> tuple[str, str]:
    """
    Resolve migration database credentials across Windows and Linux environments.

    Precedence and validation rules:
    1. If either DB_MIGRATE_USER or DB_MIGRATE_PASSWORD is set in the environment,
       the environment is the selected source.
       - If incomplete (one set, other missing): fail closed with RuntimeError.
       - If DB_MIGRATE_USER is empty or whitespace-only: fail closed with RuntimeError.
       - If DB_MIGRATE_PASSWORD is empty: fail closed with RuntimeError.
       - If valid: return (DB_MIGRATE_USER.strip(), DB_MIGRATE_PASSWORD) without querying vault.
         Password characters are preserved exactly (never trimmed).
    2. If neither environment variable is set:
       - On Windows: fall back to Windows Credential Manager ('portfolio_db_migrator').
         If target not found: fail closed with RuntimeError.
       - On Linux / non-Windows: fail closed with RuntimeError.
    3. Under NO circumstances does this function fall back to the runtime account (portfolio_user).
    4. Credential values are strictly excluded from exception messages.
    """
    user_val = os.getenv('DB_MIGRATE_USER')
    pass_val = os.getenv('DB_MIGRATE_PASSWORD')

    is_user_present = user_val is not None
    is_pass_present = pass_val is not None

    if is_user_present or is_pass_present:
        if not is_user_present:
            raise RuntimeError(
                "Incomplete migration credentials: DB_MIGRATE_PASSWORD is configured, "
                "but DB_MIGRATE_USER is missing."
            )
        if not is_pass_present:
            raise RuntimeError(
                "Incomplete migration credentials: DB_MIGRATE_USER is configured, "
                "but DB_MIGRATE_PASSWORD is missing."
            )

        user_clean = user_val.strip()
        if not user_clean:
            raise RuntimeError(
                "Invalid migration credentials: DB_MIGRATE_USER cannot be empty or whitespace-only."
            )
        if len(pass_val) == 0:
            raise RuntimeError(
                "Invalid migration credentials: DB_MIGRATE_PASSWORD cannot be empty."
            )

        return user_clean, pass_val

    if is_vault_available():
        if has_migration_credential():
            return get_migration_credential()
        raise RuntimeError(
            "Migration execution blocked: 'portfolio_db_migrator' was not found in Windows Credential Manager, "
            "and DB_MIGRATE_USER / DB_MIGRATE_PASSWORD environment variables are not configured."
        )

    raise RuntimeError(
        "Migration execution blocked: Windows Credential Manager is unavailable on this platform, "
        "and DB_MIGRATE_USER / DB_MIGRATE_PASSWORD environment variables are not configured."
    )
