"""
Comprehensive test suite for the Contact API (POST /api/contact/).
Tests validation, honeypot defense, Option A database-first persistence,
duplicate suppression heuristic, throttling, Resend HTTPS API email notifications,
and failure handling.
Conforms to docs/CONTACT-BACKEND-SPECIFICATION.md and Stage 09.3-F.
"""
import io
import json
import urllib.error
import urllib.request
import uuid
from unittest.mock import MagicMock, patch
from django.core.cache import cache
from django.db import DatabaseError
from django.test import override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from contact.models import ContactMessage
from contact.views import RECEIPT_CONFIRMATION_MESSAGE


@override_settings(RESEND_API_KEY='simulate', EMAIL_SIMULATION_ALLOWED=True)
class ContactAPITests(APITestCase):
    """
    Test suite for POST /api/contact/ endpoint and downstream notifications.
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

        with patch('contact.views.send_contact_notification') as mock_notify:
            response = self.client.post(self.url, payload, format='json')
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertEqual(response.json(), {
                "status": "error",
                "message": "Invalid submission."
            })
            mock_notify.assert_not_called()

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
        with patch('contact.views.send_contact_notification') as mock_notify:
            res2 = self.client.post(self.url, self.valid_payload, format='json')
            self.assertEqual(res2.status_code, status.HTTP_201_CREATED)
            data2 = res2.json()
            self.assertEqual(data2.get("id"), first_id)
            self.assertEqual(data2.get("message"), RECEIPT_CONFIRMATION_MESSAGE)
            mock_notify.assert_not_called()

        # Assert no second row in database
        self.assertEqual(ContactMessage.objects.count(), 1)

    # -------------------------------------------------------------------------
    # 4. Option A (Database-First) Persistence Safety Tests
    # -------------------------------------------------------------------------

    def test_outcome_1_persistence_failure_returns_500_and_no_receipt(self):
        """If MySQL persistence fails, return HTTP 500, no receipt issued, no email sent."""
        with patch('contact.models.ContactMessage.objects.create', side_effect=DatabaseError("MySQL connection closed")):
            with patch('contact.views.send_contact_notification') as mock_notify:
                response = self.client.post(self.url, self.valid_payload, format='json')
                mock_notify.assert_not_called()

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
        for i in range(5):
            payload = {
                "name": f"Visitor {i}",
                "email": f"visitor{i}@example.com",
                "message": f"Inquiry message number {i}"
            }
            res = self.client.post(self.url, payload, format='json', REMOTE_ADDR='192.168.1.100')
            self.assertEqual(res.status_code, status.HTTP_201_CREATED)

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

    # -------------------------------------------------------------------------
    # 6. Resend HTTPS API Email Notification Tests (Stage 09.3-F)
    # -------------------------------------------------------------------------

    @override_settings(
        RESEND_API_KEY='re_test_secret_api_key_123',
        CONTACT_NOTIFICATION_TO='portfolio_owner@example.com',
        CONTACT_NOTIFICATION_FROM='Portfolio Contact <notifications@example.com>'
    )
    @patch('urllib.request.urlopen')
    def test_successful_email_notification_via_mocked_resend_api(self, mock_urlopen):
        """
        Verify successful email notification via Resend HTTPS API:
        - HTTP 200 from provider marks record delivery_status='sent'
        - Visitor email is used as reply_to, NOT spoofed as the sender
        - Notification email includes visitor name, email, message, and submission reference ID
        - Outbound request contains correct Bearer authorization and JSON payload
        """
        mock_response = MagicMock()
        mock_response.status = 200
        mock_response.read.return_value = json.dumps({"id": "re_msg_test_abc123"}).encode('utf-8')
        mock_response.__enter__.return_value = mock_response
        mock_urlopen.return_value = mock_response

        response = self.client.post(self.url, self.valid_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json().get("message"), RECEIPT_CONFIRMATION_MESSAGE)
        record_id = response.json().get("id")

        msg = ContactMessage.objects.get(id=record_id)
        self.assertEqual(msg.delivery_status, ContactMessage.STATUS_SENT)
        self.assertEqual(msg.delivery_attempts, 1)
        self.assertIsNotNone(msg.last_attempt_at)
        self.assertIsNone(msg.delivery_error)

        # Inspect the outbound HTTP request sent to Resend
        mock_urlopen.assert_called_once()
        req = mock_urlopen.call_args[0][0]
        self.assertEqual(req.full_url, "https://api.resend.com/emails")
        self.assertEqual(req.get_method(), "POST")
        self.assertEqual(req.headers.get("Authorization"), "Bearer re_test_secret_api_key_123")
        self.assertEqual(req.headers.get("Content-type"), "application/json")

        payload = json.loads(req.data.decode('utf-8'))
        self.assertEqual(payload["from"], "Portfolio Contact <notifications@example.com>")
        self.assertEqual(payload["to"], ["portfolio_owner@example.com"])
        self.assertEqual(payload["reply_to"], "jane.visitor@example.com")
        self.assertIn("Jane Visitor", payload["subject"])
        self.assertIn(record_id[:8], payload["subject"])

        # Body must include name, email, message, and reference ID
        self.assertIn(record_id, payload["text"])
        self.assertIn("Jane Visitor", payload["text"])
        self.assertIn("jane.visitor@example.com", payload["text"])
        self.assertIn(self.valid_payload["message"], payload["text"])

        # HTML body must include escaped content and reference ID
        self.assertIn(record_id, payload["html"])
        self.assertIn("Jane Visitor", payload["html"])
        self.assertIn("jane.visitor@example.com", payload["html"])
        self.assertIn(self.valid_payload["message"], payload["html"])

    @override_settings(
        RESEND_API_KEY='re_test_secret_api_key_123',
        CONTACT_NOTIFICATION_TO='portfolio_owner@example.com',
        CONTACT_NOTIFICATION_FROM='Portfolio Contact <notifications@example.com>'
    )
    @patch('urllib.request.urlopen')
    def test_resend_provider_http_error_preserves_db_record_and_returns_201(self, mock_urlopen):
        """
        If Resend rejects the submission (e.g. HTTP 422 Domain Not Verified):
        - Database record remains safely persisted (Option A)
        - Visitor receives normal HTTP 201 Created and receipt confirmation
        - Delivery status is marked 'failed' with sanitized diagnostics
        - API key and message text are NOT leaked into delivery_error
        """
        error_payload = json.dumps({
            "statusCode": 422,
            "message": "The domain example.com is not verified",
            "name": "validation_error"
        }).encode('utf-8')

        http_err = urllib.error.HTTPError(
            url="https://api.resend.com/emails",
            code=422,
            msg="Unprocessable Entity",
            hdrs={},
            fp=io.BytesIO(error_payload)
        )
        mock_urlopen.side_effect = http_err

        response = self.client.post(self.url, self.valid_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        record_id = response.json().get("id")
        self.assertIsNotNone(record_id)

        msg = ContactMessage.objects.get(id=record_id)
        self.assertEqual(msg.delivery_status, ContactMessage.STATUS_FAILED)
        self.assertEqual(msg.delivery_attempts, 1)
        self.assertIsNotNone(msg.last_attempt_at)
        self.assertIn("Resend HTTP 422: The domain example.com is not verified", msg.delivery_error)
        # Verify secret key was not leaked
        self.assertNotIn("re_test_secret_api_key_123", msg.delivery_error)

    @override_settings(
        RESEND_API_KEY='re_test_secret_api_key_123',
        CONTACT_NOTIFICATION_TO='portfolio_owner@example.com',
        CONTACT_NOTIFICATION_FROM='Portfolio Contact <notifications@example.com>'
    )
    @patch('urllib.request.urlopen')
    def test_resend_network_timeout_preserves_db_record_and_returns_201(self, mock_urlopen):
        """
        If an outbound network timeout occurs:
        - Database persistence remains intact
        - Visitor receives HTTP 201 Created
        - Delivery status marked 'failed' with network error diagnosis
        """
        mock_urlopen.side_effect = urllib.error.URLError(reason="Connection timed out")

        response = self.client.post(self.url, self.valid_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        record_id = response.json().get("id")

        msg = ContactMessage.objects.get(id=record_id)
        self.assertEqual(msg.delivery_status, ContactMessage.STATUS_FAILED)
        self.assertEqual(msg.delivery_attempts, 1)
        self.assertIn("Network error: URLError (Connection timed out)", msg.delivery_error)

    @override_settings(
        RESEND_API_KEY='',
        CONTACT_NOTIFICATION_TO='',
        CONTACT_NOTIFICATION_FROM=''
    )
    @patch('urllib.request.urlopen')
    def test_missing_notification_configuration_marks_status_failed_and_preserves_db(self, mock_urlopen):
        """
        If notification environment variables are unconfigured:
        - Database record is safely persisted
        - Visitor receives HTTP 201 Created with receipt
        - Delivery status marked 'failed' with missing configuration explanation
        - delivery_attempts is 0 (no outbound attempt made)
        - Zero outbound network requests are made
        """
        response = self.client.post(self.url, self.valid_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        record_id = response.json().get("id")

        msg = ContactMessage.objects.get(id=record_id)
        self.assertEqual(msg.delivery_status, ContactMessage.STATUS_FAILED)
        self.assertEqual(msg.delivery_attempts, 0)
        self.assertIn("Missing required notification configuration", msg.delivery_error)
        self.assertIn("RESEND_API_KEY", msg.delivery_error)
        self.assertIn("CONTACT_NOTIFICATION_TO", msg.delivery_error)
        self.assertIn("CONTACT_NOTIFICATION_FROM", msg.delivery_error)

        mock_urlopen.assert_not_called()

    @override_settings(
        RESEND_API_KEY='re_valid_key',
        CONTACT_NOTIFICATION_TO='',
        CONTACT_NOTIFICATION_FROM='Portfolio Contact <notifications@example.com>'
    )
    @patch('urllib.request.urlopen')
    def test_partial_missing_configuration_identifies_exact_missing_variable(self, mock_urlopen):
        """If only CONTACT_NOTIFICATION_TO is missing, identifies it specifically and skips dispatch."""
        response = self.client.post(self.url, self.valid_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        record_id = response.json().get("id")

        msg = ContactMessage.objects.get(id=record_id)
        self.assertEqual(msg.delivery_status, ContactMessage.STATUS_FAILED)
        self.assertEqual(msg.delivery_attempts, 0)
        self.assertIn("Missing required notification configuration: CONTACT_NOTIFICATION_TO", msg.delivery_error)
        self.assertNotIn("RESEND_API_KEY", msg.delivery_error)
        mock_urlopen.assert_not_called()

    @override_settings(
        RESEND_API_KEY='simulate',
        DEBUG=False,
        EMAIL_SIMULATION_ALLOWED=False,
        CONTACT_NOTIFICATION_TO='portfolio_owner@example.com',
        CONTACT_NOTIFICATION_FROM='notifications@example.com'
    )
    @patch('urllib.request.urlopen')
    def test_simulation_mode_rejected_in_production_fails_closed(self, mock_urlopen):
        """
        When RESEND_API_KEY='simulate' in production (DEBUG=False, EMAIL_SIMULATION_ALLOWED=False):
        - Fails closed: delivery_status='failed', delivery_attempts=0
        - Database persistence remains intact: returns HTTP 201 Created and receipt ID
        - delivery_error explains that simulation is prohibited in production
        - Never labeled as 'sent' or 'simulated'
        - Zero outbound network calls
        """
        response = self.client.post(self.url, self.valid_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        record_id = response.json().get("id")

        msg = ContactMessage.objects.get(id=record_id)
        self.assertEqual(msg.delivery_status, ContactMessage.STATUS_FAILED)
        self.assertEqual(msg.delivery_attempts, 0)
        self.assertIn("Simulation mode (RESEND_API_KEY=simulate) is prohibited in production (DEBUG=False).", msg.delivery_error)
        self.assertNotEqual(msg.delivery_status, ContactMessage.STATUS_SENT)
        self.assertNotEqual(msg.delivery_status, ContactMessage.STATUS_SIMULATED)
        mock_urlopen.assert_not_called()

    @override_settings(
        RESEND_API_KEY='simulate',
        DEBUG=True,
        EMAIL_SIMULATION_ALLOWED=False,
        CONTACT_NOTIFICATION_TO='portfolio_owner@example.com',
        CONTACT_NOTIFICATION_FROM='notifications@example.com'
    )
    @patch('urllib.request.urlopen')
    def test_simulation_mode_permitted_in_local_development_when_debug_true(self, mock_urlopen):
        """When DEBUG=True, RESEND_API_KEY='simulate' is permitted and records status='simulated'."""
        response = self.client.post(self.url, self.valid_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        record_id = response.json().get("id")

        msg = ContactMessage.objects.get(id=record_id)
        self.assertEqual(msg.delivery_status, ContactMessage.STATUS_SIMULATED)
        self.assertEqual(msg.delivery_attempts, 1)
        self.assertIsNone(msg.delivery_error)
        mock_urlopen.assert_not_called()

    @override_settings(
        RESEND_API_KEY='simulate',
        DEBUG=False,
        EMAIL_SIMULATION_ALLOWED=True,
        CONTACT_NOTIFICATION_TO='portfolio_owner@example.com',
        CONTACT_NOTIFICATION_FROM='notifications@example.com'
    )
    @patch('urllib.request.urlopen')
    def test_simulation_mode_permitted_when_explicitly_overridden(self, mock_urlopen):
        """When EMAIL_SIMULATION_ALLOWED=True, simulation is permitted even if DEBUG=False."""
        response = self.client.post(self.url, self.valid_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        record_id = response.json().get("id")

        msg = ContactMessage.objects.get(id=record_id)
        self.assertEqual(msg.delivery_status, ContactMessage.STATUS_SIMULATED)
        self.assertEqual(msg.delivery_attempts, 1)
        self.assertIsNone(msg.delivery_error)
        mock_urlopen.assert_not_called()
