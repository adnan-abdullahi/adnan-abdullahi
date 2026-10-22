"""
API views for the Contact service.
Implements Option A (Database-First) persistence, honeypot defense,
60-second duplicate suppression heuristic, and decoupled notification dispatch.
Conforms strictly to docs/CONTACT-BACKEND-SPECIFICATION.md.
"""
import datetime
import logging
from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from contact.models import ContactMessage
from contact.serializers import ContactSubmissionSerializer
from contact.throttling import ContactAnonRateThrottle

logger = logging.getLogger(__name__)

RECEIPT_CONFIRMATION_MESSAGE = (
    "Message received. Thank you for reaching out — I will review your message and reply via email soon."
)


class ContactAPIView(APIView):
    """
    POST /api/contact/
    Receives visitor inquiries, enforces spam defense and rate limits,
    commits to MySQL before any downstream network dispatch, and returns
    a truthful confirmation of message persistence.
    """
    permission_classes = [AllowAny]
    throttle_classes = [ContactAnonRateThrottle]

    def post(self, request, *args, **kwargs):
        # 1. Anti-Spam Defense: Invisible Honeypot Rejection
        # If populated, immediately reject with generic error; zero DB writes, zero emails.
        honeypot_value = request.data.get('website')
        if honeypot_value:
            return Response(
                {
                    "status": "error",
                    "message": "Invalid submission."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Input Validation
        serializer = ContactSubmissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data
        if not isinstance(validated_data, dict):
            logger.error("Unexpected non-dictionary serializer validated_data: %s", type(validated_data))
            return Response(
                {
                    "status": "error",
                    "message": "Unable to save your message at this time. Please try again shortly."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        name = validated_data['name']
        email = validated_data['email']
        message = validated_data['message']

        # 3. Duplicate-Suppression Heuristic (60-second sliding window)
        # Mitigates rapid repeat double-clicks.
        # Note: This is an application-level heuristic; high-concurrency requests
        # arriving simultaneously across workers can race past this check.
        content_hash = ContactMessage.compute_content_hash(email, message)
        cutoff_time = timezone.now() - datetime.timedelta(seconds=60)

        duplicate_record = ContactMessage.objects.filter(
            content_hash=content_hash,
            created_at__gte=cutoff_time
        ).order_by('-created_at').first()

        if duplicate_record is not None:
            # Duplicate detected within window: suppress duplicate persistence and notification.
            # Returns approved receipt text with the existing record id (HTTP 201 Created).
            return Response(
                {
                    "status": "success",
                    "message": RECEIPT_CONFIRMATION_MESSAGE,
                    "id": str(duplicate_record.id),
                },
                status=status.HTTP_201_CREATED
            )

        # 4. Database-First Persistence (Option A)
        # The primary operation completes when the record is committed to MySQL.
        try:
            with transaction.atomic():
                contact_message = ContactMessage.objects.create(
                    name=name,
                    email=email,
                    message=message,
                    content_hash=content_hash,
                    delivery_status=ContactMessage.STATUS_PENDING,
                    delivery_attempts=0
                )
        except Exception as db_err:
            logger.error("Failed to commit ContactMessage to MySQL: %s", db_err, exc_info=True)
            # Never expose internal database diagnostics, credentials, or stack traces to visitor
            return Response(
                {
                    "status": "error",
                    "message": "Unable to save your message at this time. Please try again shortly."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 5. Downstream Notification Dispatch (Decoupled, Post-Commit)
        # Attempt notification only after the database record is safely committed.
        try:
            send_mail(
                subject=f"Contact Inquiry from {contact_message.name}",
                message=f"Name: {contact_message.name}\nEmail: {contact_message.email}\n\nMessage:\n{contact_message.message}",
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', None) or 'webmaster@localhost',
                recipient_list=[settings.NOTIFICATION_RECIPIENT_EMAIL],
                fail_silently=False,
            )

            # In development with console.EmailBackend (or test locmem backend), use truthful 'simulated' status
            email_backend = getattr(settings, 'EMAIL_BACKEND', '').lower()
            is_simulated = any(dev_backend in email_backend for dev_backend in ('console', 'locmem', 'dummy'))
            contact_message.delivery_status = (
                ContactMessage.STATUS_SIMULATED if is_simulated else ContactMessage.STATUS_SENT
            )
            contact_message.delivery_attempts = 1
            contact_message.last_attempt_at = timezone.now()
            contact_message.delivery_error = None
            contact_message.save(
                update_fields=['delivery_status', 'delivery_attempts', 'last_attempt_at', 'delivery_error', 'updated_at']
            )
        except Exception as notify_err:
            logger.warning("Downstream email notification failed: %s", notify_err)
            # Record failure diagnostics safely; do not invalidate MySQL persistence
            contact_message.delivery_status = ContactMessage.STATUS_FAILED
            contact_message.delivery_attempts = 1
            contact_message.last_attempt_at = timezone.now()
            # Store sanitized diagnostic info (exception type + truncated message)
            contact_message.delivery_error = f"{type(notify_err).__name__}: {str(notify_err)[:500]}"
            contact_message.save(
                update_fields=['delivery_status', 'delivery_attempts', 'last_attempt_at', 'delivery_error', 'updated_at']
            )

        # 6. Return Confirmed Receipt Response
        # Receipt is confirmed because the record is safely stored in MySQL (Outcomes 2 & 3).
        return Response(
            {
                "status": "success",
                "message": RECEIPT_CONFIRMATION_MESSAGE,
                "id": str(contact_message.id),
            },
            status=status.HTTP_201_CREATED
        )
