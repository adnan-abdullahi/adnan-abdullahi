"""
Data model definition for ContactMessage.
Conforms strictly to docs/CONTACT-BACKEND-SPECIFICATION.md Section 6.
"""
import uuid
import hashlib
from django.db import models


class ContactMessage(models.Model):
    """
    Persistent record for visitor contact submissions.
    Ensures message receipt confirmation before notification dispatch.
    """
    STATUS_PENDING = 'pending'
    STATUS_SENT = 'sent'
    STATUS_FAILED = 'failed'
    STATUS_SIMULATED = 'simulated'

    STATUS_CHOICES = (
        (STATUS_PENDING, 'Pending Dispatch'),
        (STATUS_SENT, 'Sent (Provider Accepted)'),
        (STATUS_FAILED, 'Failed'),
        (STATUS_SIMULATED, 'Simulated (Dev/Console Backend)'),
    )

    MAX_RETRIES = 3
    MAX_TOTAL_ATTEMPTS = 4

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Non-sequential, collision-resistant unique identifier."
    )
    name = models.CharField(
        max_length=100,
        help_text="Sender's submitted name."
    )
    email = models.EmailField(
        max_length=254,
        help_text="Sender's validated return email address."
    )
    message = models.TextField(
        max_length=5000,
        help_text="In-depth message content."
    )
    delivery_status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING,
        help_text="Tracks notification state (pending, sent, failed, simulated)."
    )
    delivery_attempts = models.PositiveSmallIntegerField(
        default=0,
        help_text="Cumulative count of all delivery attempts made."
    )
    last_attempt_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Timestamp of the most recent notification dispatch attempt."
    )
    delivery_error = models.TextField(
        null=True,
        blank=True,
        help_text="Diagnostic error message/status code from provider on failure."
    )
    content_hash = models.CharField(
        max_length=64,
        help_text="SHA-256 hash of email + message used for 60-second duplicate suppression heuristic."
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp of confirmed database persistence."
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp of most recent record update."
    )

    class Meta:
        db_table = 'contact_message'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['created_at'], name='contact_msg_created_idx'),
            models.Index(fields=['delivery_status'], name='contact_msg_status_idx'),
            models.Index(fields=['content_hash', 'created_at'], name='contact_msg_hash_created_idx'),
            models.Index(fields=['email'], name='contact_msg_email_idx'),
        ]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(delivery_status__in=['pending', 'sent', 'failed', 'simulated']),
                name='chk_contact_msg_status'
            ),
        ]
        verbose_name = 'Contact Message'
        verbose_name_plural = 'Contact Messages'

    def __str__(self) -> str:
        return f"ContactMessage({self.id}, from={self.email}, status={self.delivery_status})"

    @staticmethod
    def compute_content_hash(email: str, message: str) -> str:
        """
        Compute normalized SHA-256 content hash of email and message for
        the 60-second duplicate suppression heuristic.
        """
        normalized_email = email.strip().lower()
        normalized_message = message.strip()
        payload = f"{normalized_email}:{normalized_message}".encode('utf-8')
        return hashlib.sha256(payload).hexdigest()

