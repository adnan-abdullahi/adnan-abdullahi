"""
Contact notification service using the Resend HTTPS API.
Conforms strictly to docs/CONTACT-BACKEND-SPECIFICATION.md and Stage 09.3-F.

Dispatches email notifications to the portfolio owner when a contact submission
is committed to the database. Does not use SMTP, bypassing Render outbound SMTP restrictions.
"""
import html
import json
import logging
import socket
import urllib.error
import urllib.request
from django.conf import settings
from django.utils import timezone
from contact.models import ContactMessage

logger = logging.getLogger(__name__)

RESEND_API_ENDPOINT = "https://api.resend.com/emails"
REQUEST_TIMEOUT_SECONDS = 10


def send_contact_notification(contact_message: ContactMessage) -> bool:
    """
    Dispatch an email notification for a persisted ContactMessage via Resend HTTPS API.

    Safety Guarantees:
    1. Post-Commit Execution: Primary persistence is in MySQL; notification failure
       never rolls back or invalidates the saved record.
    2. Zero Secret Exposure: API keys and credentials are never logged or saved
       in delivery_error diagnostics.
    3. Correct Identity & Headers: The visitor's email is set as 'reply_to',
       not spoofed as the 'from' sender.
    4. Safe Failure Handling: Captures HTTP errors, connection timeouts, and DNS
       failures safely, updating record state to 'failed' with sanitized diagnostics.

    Returns:
        bool: True if accepted by provider (or simulated), False if failed or skipped.
    """
    api_key = getattr(settings, 'RESEND_API_KEY', '').strip()
    to_email = getattr(settings, 'CONTACT_NOTIFICATION_TO', '').strip()
    from_email = getattr(settings, 'CONTACT_NOTIFICATION_FROM', '').strip()

    # Development simulation mode
    if api_key.lower() == 'simulate':
        is_debug = getattr(settings, 'DEBUG', False)
        is_simulation_allowed = getattr(settings, 'EMAIL_SIMULATION_ALLOWED', False)

        if not is_debug and not is_simulation_allowed:
            err_message = "Simulation mode (RESEND_API_KEY=simulate) is prohibited in production (DEBUG=False)."
            logger.error(
                "Contact notification rejected for message %s: %s",
                contact_message.id,
                err_message,
            )
            contact_message.delivery_status = ContactMessage.STATUS_FAILED
            contact_message.delivery_attempts = 0
            contact_message.last_attempt_at = timezone.now()
            contact_message.delivery_error = err_message
            contact_message.save(
                update_fields=['delivery_status', 'delivery_attempts', 'last_attempt_at', 'delivery_error', 'updated_at']
            )
            return False

        logger.info(
            "Simulating contact notification for ContactMessage %s (recipient: %s, from: %s)",
            contact_message.id,
            to_email or "unconfigured@localhost",
            from_email or "unconfigured@localhost",
        )
        contact_message.delivery_status = ContactMessage.STATUS_SIMULATED
        contact_message.delivery_attempts = 1
        contact_message.last_attempt_at = timezone.now()
        contact_message.delivery_error = None
        contact_message.save(
            update_fields=['delivery_status', 'delivery_attempts', 'last_attempt_at', 'delivery_error', 'updated_at']
        )
        return True

    # Missing configuration check
    if not api_key or not to_email or not from_email:
        missing_vars = []
        if not api_key:
            missing_vars.append("RESEND_API_KEY")
        if not to_email:
            missing_vars.append("CONTACT_NOTIFICATION_TO")
        if not from_email:
            missing_vars.append("CONTACT_NOTIFICATION_FROM")
        err_message = f"Missing required notification configuration: {', '.join(missing_vars)}"
        logger.warning(
            "Contact notification skipped for message %s: %s",
            contact_message.id,
            err_message,
        )
        contact_message.delivery_status = ContactMessage.STATUS_FAILED
        contact_message.delivery_attempts = 0
        contact_message.last_attempt_at = timezone.now()
        contact_message.delivery_error = err_message
        contact_message.save(
            update_fields=['delivery_status', 'delivery_attempts', 'last_attempt_at', 'delivery_error', 'updated_at']
        )
        return False

    recipient_list = [addr.strip() for addr in to_email.split(',') if addr.strip()]
    if not recipient_list:
        err_message = "CONTACT_NOTIFICATION_TO contains no valid recipient addresses."
        logger.warning("Contact notification skipped for message %s: %s", contact_message.id, err_message)
        contact_message.delivery_status = ContactMessage.STATUS_FAILED
        contact_message.delivery_attempts = 0
        contact_message.last_attempt_at = timezone.now()
        contact_message.delivery_error = err_message
        contact_message.save(
            update_fields=['delivery_status', 'delivery_attempts', 'last_attempt_at', 'delivery_error', 'updated_at']
        )
        return False

    # Timestamp formatting for human inspection
    submission_time = contact_message.created_at or timezone.now()
    formatted_time = submission_time.strftime('%Y-%m-%d %H:%M:%S UTC')
    ref_short = str(contact_message.id)[:8]
    subject = f"Portfolio Contact: {contact_message.name} [{ref_short}]"

    text_content = (
        f"Portfolio Contact Submission\n"
        f"==================================================\n"
        f"Reference ID : {contact_message.id}\n"
        f"Received     : {formatted_time}\n"
        f"Name         : {contact_message.name}\n"
        f"Email        : {contact_message.email}\n"
        f"==================================================\n\n"
        f"Message:\n"
        f"{contact_message.message}\n\n"
        f"--------------------------------------------------\n"
        f"Note: Replying to this email will reply directly to {contact_message.email}.\n"
    )

    escaped_name = html.escape(contact_message.name)
    escaped_email = html.escape(contact_message.email)
    escaped_message = html.escape(contact_message.message)

    html_content = (
        f"<!DOCTYPE html>\n"
        f"<html>\n"
        f"<head><meta charset=\"utf-8\"></head>\n"
        f"<body style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;\">\n"
        f"  <h2 style=\"color: #0f172a; margin-bottom: 8px;\">Portfolio Contact Submission</h2>\n"
        f"  <p style=\"color: #64748b; font-size: 14px; margin-top: 0;\">Reference ID: <code style=\"background: #f1f5f9; padding: 2px 6px; border-radius: 4px;\">{contact_message.id}</code></p>\n"
        f"  <table style=\"width: 100%; border-collapse: collapse; margin: 16px 0;\">\n"
        f"    <tr>\n"
        f"      <td style=\"padding: 6px 0; color: #64748b; width: 90px; font-weight: 600;\">Name:</td>\n"
        f"      <td style=\"padding: 6px 0; color: #0f172a;\">{escaped_name}</td>\n"
        f"    </tr>\n"
        f"    <tr>\n"
        f"      <td style=\"padding: 6px 0; color: #64748b; font-weight: 600;\">Email:</td>\n"
        f"      <td style=\"padding: 6px 0; color: #0f172a;\"><a href=\"mailto:{escaped_email}\" style=\"color: #2563eb;\">{escaped_email}</a></td>\n"
        f"    </tr>\n"
        f"    <tr>\n"
        f"      <td style=\"padding: 6px 0; color: #64748b; font-weight: 600;\">Received:</td>\n"
        f"      <td style=\"padding: 6px 0; color: #0f172a;\">{formatted_time}</td>\n"
        f"    </tr>\n"
        f"  </table>\n"
        f"  <h3 style=\"color: #0f172a; margin-bottom: 8px;\">Message:</h3>\n"
        f"  <div style=\"background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; white-space: pre-wrap; font-family: inherit; color: #334155;\">{escaped_message}</div>\n"
        f"  <p style=\"margin-top: 24px; font-size: 13px; color: #64748b;\">Replying to this email will reply directly to <a href=\"mailto:{escaped_email}\" style=\"color: #2563eb;\">{escaped_email}</a>.</p>\n"
        f"</body>\n"
        f"</html>\n"
    )

    payload = {
        "from": from_email,
        "to": recipient_list,
        "reply_to": contact_message.email,
        "subject": subject,
        "text": text_content,
        "html": html_content,
    }

    payload_bytes = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(
        RESEND_API_ENDPOINT,
        data=payload_bytes,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "User-Agent": "AdnanAbdullahi-Portfolio/1.0",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT_SECONDS) as response:
            status_code = response.status
            body = response.read().decode('utf-8', errors='replace')
            provider_id = None
            try:
                data = json.loads(body)
                provider_id = data.get('id')
            except Exception:
                pass

            contact_message.delivery_status = ContactMessage.STATUS_SENT
            contact_message.delivery_attempts = 1
            contact_message.last_attempt_at = timezone.now()
            contact_message.delivery_error = None
            contact_message.save(
                update_fields=['delivery_status', 'delivery_attempts', 'last_attempt_at', 'delivery_error', 'updated_at']
            )
            logger.info(
                "Contact notification delivered to Resend for message %s (provider_id=%s, status=%s)",
                contact_message.id,
                provider_id,
                status_code,
            )
            return True

    except urllib.error.HTTPError as http_err:
        err_body = http_err.read().decode('utf-8', errors='replace')
        detail = None
        try:
            err_json = json.loads(err_body)
            detail = err_json.get('message') or err_json.get('name')
        except Exception:
            detail = err_body[:200]

        sanitized_error = f"Resend HTTP {http_err.code}: {detail or 'Unknown error'}"
        logger.warning(
            "Contact notification failed for message %s: %s",
            contact_message.id,
            sanitized_error,
        )
        contact_message.delivery_status = ContactMessage.STATUS_FAILED
        contact_message.delivery_attempts = 1
        contact_message.last_attempt_at = timezone.now()
        contact_message.delivery_error = sanitized_error[:500]
        contact_message.save(
            update_fields=['delivery_status', 'delivery_attempts', 'last_attempt_at', 'delivery_error', 'updated_at']
        )
        return False

    except (urllib.error.URLError, TimeoutError, socket.timeout) as net_err:
        reason = getattr(net_err, 'reason', str(net_err))
        sanitized_error = f"Network error: {type(net_err).__name__} ({str(reason)[:200]})"
        logger.warning(
            "Contact notification network error for message %s: %s",
            contact_message.id,
            sanitized_error,
        )
        contact_message.delivery_status = ContactMessage.STATUS_FAILED
        contact_message.delivery_attempts = 1
        contact_message.last_attempt_at = timezone.now()
        contact_message.delivery_error = sanitized_error[:500]
        contact_message.save(
            update_fields=['delivery_status', 'delivery_attempts', 'last_attempt_at', 'delivery_error', 'updated_at']
        )
        return False
    except Exception as unexpected_err:
        sanitized_error = f"Unexpected error: {type(unexpected_err).__name__} ({str(unexpected_err)[:200]})"
        logger.warning(
            "Unexpected error during contact notification for message %s: %s",
            contact_message.id,
            sanitized_error,
        )
        contact_message.delivery_status = ContactMessage.STATUS_FAILED
        contact_message.delivery_attempts = 1
        contact_message.last_attempt_at = timezone.now()
        contact_message.delivery_error = sanitized_error[:500]
        contact_message.save(
            update_fields=['delivery_status', 'delivery_attempts', 'last_attempt_at', 'delivery_error', 'updated_at']
        )
        return False
