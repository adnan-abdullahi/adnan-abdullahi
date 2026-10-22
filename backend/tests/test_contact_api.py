"""
Comprehensive test suite for the Contact API (POST /api/contact/).
Tests validation, honeypot defense, Option A database-first persistence,
duplicate suppression heuristic, throttling, and simulated email status.
Conforms to docs/CONTACT-BACKEND-SPECIFICATION.md Section 7.2.
"""
from unittest.mock import patch
import uuid
from django.core.cache import cache
from django.db import DatabaseError
from django.test import override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from contact.models import ContactMessage
from contact.views import RECEIPT_CONFIRMATION_MESSAGE


class ContactAPITests(APITestCase):
    """
    Test suite for POST /api/contact/ endpoint.
    """

    def setUp(self):
        super().setUp()
        cache.clear()
        self.url = reverse('contact-submit')
        self.valid_payload = {
            "name": "Jane Visitor",
            "email": "jane.visitor@example.com",
            "message": "Hello, I would like to discuss an engineering collaboration opportunity."
        }

    # -------------------------------------------------------------------------
    # 1. Validation & Field Integrity Tests
    # -------------------------------------------------------------------------

    def test_valid_submission_persists_exactly_one_record(self):
        """A valid submission persists exactly 1 record with delivery_status='simulated'."""
        initial_count = ContactMessage.objects.count()
        response = self.client.post(self.url, self.valid_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ContactMessage.objects.count(), initial_count + 1)

        msg = ContactMessage.objects.latest('created_at')
        self.assertEqual(msg.name, "Jane Visitor")
        self.assertEqual(msg.email, "jane.visitor@example.com")
        self.assertEqual(msg.message, self.valid_payload["message"])
        self.assertEqual(msg.delivery_status, ContactMessage.STATUS_SIMULATED)
        self.assertEqual(msg.delivery_attempts, 1)
        self.assertIsNotNone(msg.last_attempt_at)
        self.assertIsNone(msg.delivery_error)
        self.assertTrue(uuid.UUID(str(msg.id)))

    def test_receipt_response_format_and_message(self):
        """Receipt response returns exact approved message and record UUID."""
        response = self.client.post(self.url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.json()
        self.assertEqual(data.get("status"), "success")
        self.assertEqual(data.get("message"), RECEIPT_CONFIRMATION_MESSAGE)
        self.assertTrue("id" in data)

    def test_missing_required_fields_rejected(self):
        """Missing name, email, or message returns HTTP 400 without creating database records."""
        initial_count = ContactMessage.objects.count()

        for field in ("name", "email", "message"):
            payload = self.valid_payload.copy()
            del payload[field]
            response = self.client.post(self.url, payload, format='json')
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            data = response.json()
            self.assertEqual(data.get("status"), "error")
            self.assertIn("errors", data)
            self.assertIn(field, data["errors"])

        self.assertEqual(ContactMessage.objects.count(), initial_count)

    def test_blank_fields_rejected(self):
        """Blank strings return HTTP 400 and create zero records."""
        initial_count = ContactMessage.objects.count()

        for field in ("name", "email", "message"):
            payload = self.valid_payload.copy()
            payload[field] = "   "
            response = self.client.post(self.url, payload, format='json')
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertEqual(ContactMessage.objects.count(), initial_count)

    def test_name_length_limit(self):
        """Name exceeding 100 characters returns HTTP 400."""
        payload = self.valid_payload.copy()
        payload["name"] = "A" * 101
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.json().get("errors", {}))

    def test_email_length_limit(self):
        """Email exceeding 254 characters returns HTTP 400."""
        payload = self.valid_payload.copy()
        payload["email"] = "a" * 245 + "@example.com"  # 257 chars
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.json().get("errors", {}))

    def test_invalid_email_syntax_rejected(self):
        """Invalid email syntax returns HTTP 400."""
        for invalid_email in ("not-an-email", "@missinguser.com", "user@", "user@.com"):
            payload = self.valid_payload.copy()
            payload["email"] = invalid_email
            response = self.client.post(self.url, payload, format='json')
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_message_length_limit(self):
        """Message exceeding 5000 characters returns HTTP 400."""
        payload = self.valid_payload.copy()
        payload["message"] = "M" * 5001
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("message", response.json().get("errors", {}))

    def test_crlf_header_injection_prevention(self):
        """CR and LF characters in name or email are strictly rejected."""
        initial_count = ContactMessage.objects.count()

        # Newline in name
        payload = self.valid_payload.copy()
        payload["name"] = "Attacker\nBcc: evil@example.com"
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Carriage return in name
        payload["name"] = "Attacker\rSubject: Injected"
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Newline in email
        payload = self.valid_payload.copy()
        payload["email"] = "attacker@example.com\nBcc: evil@example.com"
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertEqual(ContactMessage.objects.count(), initial_count)

    # -------------------------------------------------------------------------
    # 2. Anti-Spam & Honeypot Defense Tests
    # -------------------------------------------------------------------------

    def test_populated_honeypot_returns_generic_error_and_zero_writes(self):
        """If honeypot 'website' is populated, returns HTTP 400 with 'Invalid submission.' and zero writes."""
        initial_count = ContactMessage.objects.count()
        payload = self.valid_payload.copy()
        payload["website"] = "http://spam-link.com"

        with patch('contact.views.send_mail') as mock_send:
            response = self.client.post(self.url, payload, format='json')
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertEqual(response.json(), {
                "status": "error",
                "message": "Invalid submission."
            })
            mock_send.assert_not_called()

        self.assertEqual(ContactMessage.objects.count(), initial_count)

    # -------------------------------------------------------------------------
    # 3. Duplicate Suppression Tests
    # -------------------------------------------------------------------------

    def test_duplicate_submission_within_60_seconds_suppressed(self):
        """Identical submission within 60s returns HTTP 201 with existing ID without creating a 2nd record."""
        # Initial submission
        res1 = self.client.post(self.url, self.valid_payload, format='json')
        self.assertEqual(res1.status_code, status.HTTP_201_CREATED)
        first_id = res1.json().get("id")

        self.assertEqual(ContactMessage.objects.count(), 1)

        # Immediate duplicate submission
        with patch('contact.views.send_mail') as mock_send:
            res2 = self.client.post(self.url, self.valid_payload, format='json')
            self.assertEqual(res2.status_code, status.HTTP_201_CREATED)
            data2 = res2.json()
            self.assertEqual(data2.get("id"), first_id)
            self.assertEqual(data2.get("message"), RECEIPT_CONFIRMATION_MESSAGE)
            mock_send.assert_not_called()

        # Assert no second row in database
        self.assertEqual(ContactMessage.objects.count(), 1)

    # -------------------------------------------------------------------------
    # 4. Option A (Database-First) & Notification Failure Tests
    # -------------------------------------------------------------------------

    def test_outcome_2_persistence_success_notification_failure_returns_201(self):
        """If MySQL commit succeeds but email notification fails, return 201 and record failure state."""
        with patch('contact.views.send_mail', side_effect=RuntimeError("SMTP connection dropped")):
            response = self.client.post(self.url, self.valid_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json().get("message"), RECEIPT_CONFIRMATION_MESSAGE)

        msg = ContactMessage.objects.latest('created_at')
        self.assertEqual(msg.delivery_status, ContactMessage.STATUS_FAILED)
        self.assertEqual(msg.delivery_attempts, 1)
        self.assertIsNotNone(msg.last_attempt_at)
        self.assertIn("RuntimeError: SMTP connection dropped", msg.delivery_error)

    def test_outcome_1_persistence_failure_returns_500_and_no_receipt(self):
        """If MySQL persistence fails, return HTTP 500, no receipt issued, no email sent."""
        with patch('contact.models.ContactMessage.objects.create', side_effect=DatabaseError("MySQL connection closed")):
            with patch('contact.views.send_mail') as mock_send:
                response = self.client.post(self.url, self.valid_payload, format='json')
                mock_send.assert_not_called()

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        data = response.json()
        self.assertEqual(data.get("status"), "error")
        self.assertEqual(data.get("message"), "Unable to save your message at this time. Please try again shortly.")
        self.assertNotIn("id", data)

    # -------------------------------------------------------------------------
    # 5. Anonymous Rate Throttling Tests
    # -------------------------------------------------------------------------

    def test_rate_throttling_enforced_at_five_submissions(self):
        """Submitting > 5 requests from same client IP triggers HTTP 429."""
        # 5 allowed submissions with distinct messages to avoid duplicate suppression
        for i in range(5):
            payload = {
                "name": f"Visitor {i}",
                "email": f"visitor{i}@example.com",
                "message": f"Inquiry message number {i}"
            }
            res = self.client.post(self.url, payload, format='json', REMOTE_ADDR='192.168.1.100')
            self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # 6th submission should be throttled
        throttled_payload = {
            "name": "Visitor 6",
            "email": "visitor6@example.com",
            "message": "Inquiry message number 6"
        }
        res6 = self.client.post(self.url, throttled_payload, format='json', REMOTE_ADDR='192.168.1.100')
        self.assertEqual(res6.status_code, status.HTTP_429_TOO_MANY_REQUESTS)
        data6 = res6.json()
        self.assertEqual(data6.get("status"), "error")
        self.assertEqual(data6.get("message"), "Submission rate limit exceeded. Please wait a few moments before trying again.")
        self.assertIn("Retry-After", res6.headers)

