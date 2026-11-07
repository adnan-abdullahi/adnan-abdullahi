"""
Data model definition for ContactMessage.
Conforms strictly to docs/CONTACT-BACKEND-SPECIFICATION.md Section 6.
"""
import uuid
import hashlib
from django.core.exceptions import ValidationError
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

    def clean_delivery_status(self) -> None:
        """
        Validate that delivery_status conforms to STATUS_CHOICES.
        Provides application-level data integrity while database CHECK constraints
        are unenforced in TiDB Serverless (tidb_enable_check_constraint = OFF).
        """
        valid_statuses = {choice[0] for choice in self.STATUS_CHOICES}
        if self.delivery_status not in valid_statuses:
            raise ValidationError({
                'delivery_status': (
                    f"Invalid delivery status '{self.delivery_status}'. "
                    f"Must be one of: {sorted(valid_statuses)}."
                )
            })

    def clean(self) -> None:
        """Standard Django model validation entry point."""
        super().clean()
        self.clean_delivery_status()

    def save(self, *args, **kwargs) -> None:
        """
        Enforce delivery_status validation before database persistence.
        Guards both full saves (objects.create / save()) and partial updates
        where delivery_status is explicitly listed in update_fields.
        """
        update_fields = kwargs.get('update_fields')
        if update_fields is None and len(args) >= 4:
            update_fields = args[3]

        if update_fields is not None:
            # Normalize to frozenset to safely support any iterable without multiple consumption
            update_fields = frozenset(update_fields)
            if 'update_fields' in kwargs:
                kwargs['update_fields'] = update_fields
            elif len(args) >= 4:
                args = list(args)
                args[3] = update_fields
                args = tuple(args)

            # If update_fields is empty, Django bails out as a no-op; do not validate
            if not update_fields:
                super().save(*args, **kwargs)
                return

            if 'delivery_status' in update_fields:
                self.clean_delivery_status()
        else:
            self.clean_delivery_status()

        super().save(*args, **kwargs)

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

