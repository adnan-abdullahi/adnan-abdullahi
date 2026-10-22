"""
Credential Vault utility for Windows Credential Manager.
Retrieves and stores credentials using the native Win32 advapi32.dll API.
Zero secrets are stored in this file.
"""
import ctypes
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

DEFAULT_TARGET = "portfolio_db_migrator"

def store_migration_credential(username: str, password: str, target: str = DEFAULT_TARGET) -> None:
    """Store migration credential in Windows Credential Manager without exposing to disk or env."""
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

def get_migration_credential(target: str = DEFAULT_TARGET) -> tuple[str, str]:
    """Retrieve migration (username, password) tuple from Windows Credential Manager."""
    p_cred = PCREDENTIAL()
    if not CredReadW(target, CRED_TYPE_GENERIC, 0, ctypes.byref(p_cred)):
        err = ctypes.GetLastError()
        raise RuntimeError(f"CredReadW failed for target '{target}' with error code: {err}")
    cred = p_cred.contents
    username = cred.UserName
    blob = ctypes.string_at(cred.CredentialBlob, cred.CredentialBlobSize)
    password = blob.decode('utf-8')
    CredFree(p_cred)
    return username, password

def has_migration_credential(target: str = DEFAULT_TARGET) -> bool:
    """Check if migration credential exists in Windows Credential Manager."""
    p_cred = PCREDENTIAL()
    if CredReadW(target, CRED_TYPE_GENERIC, 0, ctypes.byref(p_cred)):
        CredFree(p_cred)
        return True
    return False

def delete_migration_credential(target: str = DEFAULT_TARGET) -> None:
    """Delete migration credential from Windows Credential Manager."""
    if not CredDeleteW(target, CRED_TYPE_GENERIC, 0):
        err = ctypes.GetLastError()
        raise RuntimeError(f"CredDeleteW failed with error code: {err}")

