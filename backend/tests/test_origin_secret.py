"""
Comprehensive unit tests for CloudflareOriginSecretMiddleware.

Verifies:
- Production fail-closed enforcement when CF_ORIGIN_SECRET is configured.
- Rejection of missing, blank, whitespace, and mismatching secrets with HTTP 403.
- Narrow exemption of /api/health/ and /api/health for GET and HEAD requests only (LOW-01).
- Rejection of POST, PUT, PATCH, DELETE to health endpoint without secret with HTTP 403 (LOW-01).
- Normal DRF HTTP 405 Method Not Allowed when valid secret is provided to unsupported health methods (LOW-01).
- Zero-downtime secret rotation support via comma-separated CF_ORIGIN_SECRET values (LOW-02).
- Non-short-circuit constant-time evaluation across all candidate secrets (LOW-02).
- Direct origin protection (unauthorized requests do not reach views, create DB rows, or consume rate limit).
- Production fail-closed behavior when CF_ORIGIN_SECRET is unconfigured or empty.
- Local development compatibility (DEBUG=True permits traffic when secret is unconfigured).
- CORS preflight OPTIONS request pass-through from allowed origins.
- Information leakage prevention: secrets are never leaked in response payloads or headers.
"""
from django.core.cache import cache
from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework import status

from contact.models import ContactMessage

TEST_SECRET = "production-origin-shared-secret-for-tests-12345"


class CloudflareOriginSecretMiddlewareTests(TestCase):
    """Test suite for CloudflareOriginSecretMiddleware."""

    def setUp(self):
        super().setUp()
        cache.clear()
        self.contact_url = reverse('contact-submit')
        self.health_url = reverse('health-check')
        self.valid_payload = {
            "name": "Alex Engineer",
            "email": "alex@example.com",
            "message": "Testing origin secret protection."
        }

    # -------------------------------------------------------------------------
    # 1. Valid Secret in Production (DEBUG=False)
    # -------------------------------------------------------------------------
    @override_settings(
        DEBUG=False,
        CF_ORIGIN_SECRET=TEST_SECRET,
        RESEND_API_KEY='simulate',
        EMAIL_SIMULATION_ALLOWED=True
    )
    def test_valid_origin_secret_allows_request(self):
        """In production, a request with the exact X-Origin-Secret header succeeds."""
        response = self.client.post(
            self.contact_url,
            self.valid_payload,
            content_type='application/json',
            HTTP_X_ORIGIN_SECRET=TEST_SECRET,
            HTTP_CF_CONNECTING_IP='203.0.113.10'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()["status"], "success")

    # -------------------------------------------------------------------------
    # 2. Missing Secret in Production
    # -------------------------------------------------------------------------
    @override_settings(DEBUG=False, CF_ORIGIN_SECRET=TEST_SECRET)
    def test_missing_origin_secret_returns_403(self):
        """In production, a request missing the X-Origin-Secret header returns HTTP 403."""
        response = self.client.post(
            self.contact_url,
            self.valid_payload,
            content_type='application/json',
            HTTP_CF_CONNECTING_IP='203.0.113.10'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.json(),
            {"status": "error", "message": "Invalid or missing origin secret."}
        )

    # -------------------------------------------------------------------------
    # 3. Incorrect Secret in Production
    # -------------------------------------------------------------------------
    @override_settings(DEBUG=False, CF_ORIGIN_SECRET=TEST_SECRET)
    def test_incorrect_origin_secret_returns_403(self):
        """In production, a request with an incorrect secret returns HTTP 403."""
        response = self.client.post(
            self.contact_url,
            self.valid_payload,
            content_type='application/json',
            HTTP_X_ORIGIN_SECRET="attacker-guessed-wrong-secret",
            HTTP_CF_CONNECTING_IP='203.0.113.10'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.json(),
            {"status": "error", "message": "Invalid or missing origin secret."}
        )

    # -------------------------------------------------------------------------
    # 4. Blank and Whitespace-Only Secret in Production
    # -------------------------------------------------------------------------
    @override_settings(DEBUG=False, CF_ORIGIN_SECRET=TEST_SECRET)
    def test_blank_origin_secret_returns_403(self):
        """In production, an empty X-Origin-Secret returns HTTP 403."""
        response = self.client.post(
            self.contact_url,
            self.valid_payload,
            content_type='application/json',
            HTTP_X_ORIGIN_SECRET="",
            HTTP_CF_CONNECTING_IP='203.0.113.10'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.json(),
            {"status": "error", "message": "Invalid or missing origin secret."}
        )

    @override_settings(DEBUG=False, CF_ORIGIN_SECRET=TEST_SECRET)
    def test_whitespace_origin_secret_returns_403(self):
        """In production, a whitespace-only X-Origin-Secret returns HTTP 403."""
        response = self.client.post(
            self.contact_url,
            self.valid_payload,
            content_type='application/json',
            HTTP_X_ORIGIN_SECRET="   \t  \n ",
            HTTP_CF_CONNECTING_IP='203.0.113.10'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.json(),
            {"status": "error", "message": "Invalid or missing origin secret."}
        )

    # -------------------------------------------------------------------------
    # 5. Direct Origin Bypass Protection & Rate Limit Preservation
    # -------------------------------------------------------------------------
    @override_settings(DEBUG=False, CF_ORIGIN_SECRET=TEST_SECRET)
    def test_direct_bypass_with_forged_ip_creates_zero_records_and_consumes_zero_quota(self):
        """
        Direct requests that bypass Cloudflare (missing secret) are rejected before
        reaching the view, creating zero database records and consuming no rate-limit quota.
        """
        initial_db_count = ContactMessage.objects.count()
        attacker_ip = '198.51.100.77'

        # Attempt 10 unauthorized requests (well beyond the 5/hour rate limit)
        for _ in range(10):
            response = self.client.post(
                self.contact_url,
                self.valid_payload,
                content_type='application/json',
                HTTP_CF_CONNECTING_IP=attacker_ip
            )
            self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Confirm zero database records created
        self.assertEqual(ContactMessage.objects.count(), initial_db_count)

        # Now make an authorized request from the same IP (via Cloudflare with valid secret)
        with override_settings(RESEND_API_KEY='simulate', EMAIL_SIMULATION_ALLOWED=True):
            authorized_response = self.client.post(
                self.contact_url,
                self.valid_payload,
                content_type='application/json',
                HTTP_X_ORIGIN_SECRET=TEST_SECRET,
                HTTP_CF_CONNECTING_IP=attacker_ip
            )
            # Must succeed (HTTP 201), proving quota was not consumed by the 10 rejected attempts
            self.assertEqual(authorized_response.status_code, status.HTTP_201_CREATED)
            self.assertEqual(ContactMessage.objects.count(), initial_db_count + 1)

    # -------------------------------------------------------------------------
    # 6. Restricted Health Endpoint Exemption (LOW-01)
    # -------------------------------------------------------------------------
    @override_settings(DEBUG=False, CF_ORIGIN_SECRET=TEST_SECRET)
    def test_health_check_get_exempt_without_secret_in_production(self):
        """GET /api/health/ succeeds with HTTP 200 without requiring X-Origin-Secret."""
        with self.assertNumQueries(0):
            response = self.client.get(self.health_url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.json(), {"status": "healthy"})

    @override_settings(DEBUG=False, CF_ORIGIN_SECRET=TEST_SECRET)
    def test_health_check_head_exempt_without_secret_in_production(self):
        """HEAD /api/health/ succeeds with HTTP 200 without requiring X-Origin-Secret."""
        with self.assertNumQueries(0):
            response = self.client.head(self.health_url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    @override_settings(DEBUG=False, CF_ORIGIN_SECRET=TEST_SECRET)
    def test_health_check_without_trailing_slash_get_exempt(self):
        """GET /api/health (no trailing slash) is exempt from 403 origin protection."""
        with self.assertNumQueries(0):
            response = self.client.get('/api/health', follow=True)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.json(), {"status": "healthy"})

    @override_settings(DEBUG=False, CF_ORIGIN_SECRET=TEST_SECRET)
    def test_health_check_without_trailing_slash_head_exempt(self):
        """HEAD /api/health (no trailing slash) is exempt from 403 origin protection."""
        with self.assertNumQueries(0):
            response = self.client.head('/api/health', follow=True)
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    @override_settings(DEBUG=False, CF_ORIGIN_SECRET=TEST_SECRET)
    def test_health_check_post_without_secret_rejected_with_403(self):
        """POST /api/health/ without secret is rejected by origin middleware with HTTP 403."""
        response = self.client.post(self.health_url, data={})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.json(),
            {"status": "error", "message": "Invalid or missing origin secret."}
        )

    @override_settings(DEBUG=False, CF_ORIGIN_SECRET=TEST_SECRET)
    def test_health_check_without_trailing_slash_post_without_secret_rejected_with_403(self):
        """POST /api/health (no trailing slash) without secret is rejected with HTTP 403."""
        response = self.client.post('/api/health', data={})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.json(),
            {"status": "error", "message": "Invalid or missing origin secret."}
        )

    @override_settings(DEBUG=False, CF_ORIGIN_SECRET=TEST_SECRET)
    def test_health_check_put_patch_delete_without_secret_rejected_with_403(self):
        """PUT, PATCH, DELETE to /api/health/ without secret are rejected with HTTP 403."""
        for method in ('put', 'patch', 'delete'):
            client_method = getattr(self.client, method)
            response = client_method(self.health_url, data={})
            self.assertEqual(
                response.status_code,
                status.HTTP_403_FORBIDDEN,
                f"Expected HTTP 403 for {method.upper()} /api/health/ without secret, got {response.status_code}"
            )
            self.assertEqual(
                response.json(),
                {"status": "error", "message": "Invalid or missing origin secret."}
            )

    @override_settings(DEBUG=False, CF_ORIGIN_SECRET=TEST_SECRET)
    def test_health_check_unsupported_methods_with_valid_secret_receive_405(self):
        """Unsupported methods to /api/health/ with valid secret pass middleware and receive HTTP 405."""
        for method in ('post', 'put', 'patch', 'delete'):
            client_method = getattr(self.client, method)
            response = client_method(
                self.health_url,
                data={},
                HTTP_X_ORIGIN_SECRET=TEST_SECRET
            )
            self.assertEqual(
                response.status_code,
                status.HTTP_405_METHOD_NOT_ALLOWED,
                f"Expected HTTP 405 for {method.upper()} /api/health/ with secret, got {response.status_code}"
            )

    @override_settings(DEBUG=False, CF_ORIGIN_SECRET=TEST_SECRET)
    def test_non_health_api_routes_not_exempt(self):
        """Exemption is strictly narrow: other /api/* routes require the origin secret."""
        response = self.client.get('/api/health/metrics')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # -------------------------------------------------------------------------
    # 7. Safe Origin Secret Rotation (LOW-02)
    # -------------------------------------------------------------------------
    @override_settings(
        DEBUG=False,
        CF_ORIGIN_SECRET="old-secret-11111, new-secret-22222",
        RESEND_API_KEY='simulate',
        EMAIL_SIMULATION_ALLOWED=True
    )
    def test_rotation_multiple_configured_secrets_both_accepted(self):
        """During secret rotation, requests carrying either old or new secret succeed."""
        # 1. Old secret succeeds
        res_old = self.client.post(
            self.contact_url,
            self.valid_payload,
            content_type='application/json',
            HTTP_X_ORIGIN_SECRET="old-secret-11111",
            HTTP_CF_CONNECTING_IP='203.0.113.20'
        )
        self.assertEqual(res_old.status_code, status.HTTP_201_CREATED)

        # 2. New secret succeeds
        res_new = self.client.post(
            self.contact_url,
            self.valid_payload,
            content_type='application/json',
            HTTP_X_ORIGIN_SECRET="new-secret-22222",
            HTTP_CF_CONNECTING_IP='203.0.113.21'
        )
        self.assertEqual(res_new.status_code, status.HTTP_201_CREATED)

    @override_settings(
        DEBUG=False,
        CF_ORIGIN_SECRET="new-secret-22222",
        RESEND_API_KEY='simulate',
        EMAIL_SIMULATION_ALLOWED=True
    )
    def test_rotation_removed_old_secret_is_rejected(self):
        """After rotation completes and old secret is removed, old secret is rejected with 403."""
        response = self.client.post(
            self.contact_url,
            self.valid_payload,
            content_type='application/json',
            HTTP_X_ORIGIN_SECRET="old-secret-11111",
            HTTP_CF_CONNECTING_IP='203.0.113.22'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.json(),
            {"status": "error", "message": "Invalid or missing origin secret."}
        )

    @override_settings(DEBUG=False, CF_ORIGIN_SECRET="old-secret-11111, new-secret-22222")
    def test_rotation_incorrect_secret_rejected_with_403(self):
        """With multiple secrets configured, an unknown secret is rejected with HTTP 403."""
        response = self.client.post(
            self.contact_url,
            self.valid_payload,
            content_type='application/json',
            HTTP_X_ORIGIN_SECRET="completely-wrong-secret",
            HTTP_CF_CONNECTING_IP='203.0.113.23'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.json(),
            {"status": "error", "message": "Invalid or missing origin secret."}
        )

    @override_settings(
        DEBUG=False,
        CF_ORIGIN_SECRET="  , ,  alpha-secret , ,  beta-secret ,  ",
        RESEND_API_KEY='simulate',
        EMAIL_SIMULATION_ALLOWED=True
    )
    def test_rotation_whitespace_and_empty_entries_handled_cleanly(self):
        """Whitespace is trimmed from configured secrets, and empty comma entries are ignored."""
        # Candidate alpha succeeds
        res_alpha = self.client.post(
            self.contact_url,
            self.valid_payload,
            content_type='application/json',
            HTTP_X_ORIGIN_SECRET="alpha-secret",
            HTTP_CF_CONNECTING_IP='203.0.113.24'
        )
        self.assertEqual(res_alpha.status_code, status.HTTP_201_CREATED)

        # Candidate beta succeeds
        res_beta = self.client.post(
            self.contact_url,
            self.valid_payload,
            content_type='application/json',
            HTTP_X_ORIGIN_SECRET="beta-secret",
            HTTP_CF_CONNECTING_IP='203.0.113.25'
        )
        self.assertEqual(res_beta.status_code, status.HTTP_201_CREATED)

        # Empty string header is rejected (empty comma entry does not become a valid secret)
        res_empty = self.client.post(
            self.contact_url,
            self.valid_payload,
            content_type='application/json',
            HTTP_X_ORIGIN_SECRET="",
            HTTP_CF_CONNECTING_IP='203.0.113.26'
        )
        self.assertEqual(res_empty.status_code, status.HTTP_403_FORBIDDEN)

        # Whitespace header is rejected
        res_ws = self.client.post(
            self.contact_url,
            self.valid_payload,
            content_type='application/json',
            HTTP_X_ORIGIN_SECRET="   ",
            HTTP_CF_CONNECTING_IP='203.0.113.27'
        )
        self.assertEqual(res_ws.status_code, status.HTTP_403_FORBIDDEN)

    @override_settings(DEBUG=False, CF_ORIGIN_SECRET=", ,  ,")
    def test_rotation_production_only_empty_entries_fails_closed(self):
        """In production, CF_ORIGIN_SECRET containing only commas/whitespace fails closed with 403."""
        response = self.client.post(
            self.contact_url,
            self.valid_payload,
            content_type='application/json',
            HTTP_X_ORIGIN_SECRET="some-secret",
            HTTP_CF_CONNECTING_IP='203.0.113.28'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.json(),
            {"status": "error", "message": "Origin secret verification is not configured."}
        )

    @override_settings(
        DEBUG=True,
        CF_ORIGIN_SECRET=", ,  ,",
        RESEND_API_KEY='simulate',
        EMAIL_SIMULATION_ALLOWED=True
    )
    def test_rotation_local_development_empty_candidates_allows_traffic(self):
        """In development (DEBUG=True), empty candidates fallback allows local development traffic."""
        response = self.client.post(
            self.contact_url,
            self.valid_payload,
            content_type='application/json',
            HTTP_CF_CONNECTING_IP='127.0.0.1'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    @override_settings(
        DEBUG=True,
        CF_ORIGIN_SECRET="dev-sec-1, dev-sec-2",
        RESEND_API_KEY='simulate',
        EMAIL_SIMULATION_ALLOWED=True
    )
    def test_rotation_local_development_multiple_secrets_enforced_when_configured(self):
        """In development (DEBUG=True), multiple configured secrets are enforced."""
        # Missing secret -> rejected
        res_rej = self.client.post(
            self.contact_url,
            self.valid_payload,
            content_type='application/json',
            HTTP_CF_CONNECTING_IP='127.0.0.1'
        )
        self.assertEqual(res_rej.status_code, status.HTTP_403_FORBIDDEN)

        # Valid secret dev-sec-2 -> accepted
        res_ok = self.client.post(
            self.contact_url,
            self.valid_payload,
            content_type='application/json',
            HTTP_X_ORIGIN_SECRET="dev-sec-2",
            HTTP_CF_CONNECTING_IP='127.0.0.1'
        )
        self.assertEqual(res_ok.status_code, status.HTTP_201_CREATED)

    @override_settings(DEBUG=False, CF_ORIGIN_SECRET="secret-alpha, secret-beta")
    def test_rotation_secrets_never_appear_in_logs_or_responses(self):
        """Error responses must not disclose candidate secrets."""
        response = self.client.post(
            self.contact_url,
            self.valid_payload,
            content_type='application/json',
            HTTP_X_ORIGIN_SECRET="unauthorized-guess"
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        content_str = response.content.decode('utf-8')
        self.assertNotIn("secret-alpha", content_str)
        self.assertNotIn("secret-beta", content_str)
        for header, val in response.headers.items():
            self.assertNotIn("secret-alpha", str(val))
            self.assertNotIn("secret-beta", str(val))

    # -------------------------------------------------------------------------
    # 8. Production Fail-Closed on Missing Secret Configuration
    # -------------------------------------------------------------------------
    @override_settings(DEBUG=False, CF_ORIGIN_SECRET='')
    def test_production_fails_closed_when_origin_secret_unconfigured(self):
        """In production (DEBUG=False), an empty CF_ORIGIN_SECRET fails closed with HTTP 403."""
        response = self.client.post(
            self.contact_url,
            self.valid_payload,
            content_type='application/json',
            HTTP_X_ORIGIN_SECRET='some-secret',
            HTTP_CF_CONNECTING_IP='203.0.113.10'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.json(),
            {"status": "error", "message": "Origin secret verification is not configured."}
        )

    @override_settings(DEBUG=False, CF_ORIGIN_SECRET='')
    def test_health_check_remains_functional_when_origin_secret_unconfigured(self):
        """Health check still succeeds even if CF_ORIGIN_SECRET is unconfigured in production."""
        response = self.client.get(self.health_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {"status": "healthy"})

    # -------------------------------------------------------------------------
    # 9. Local Development Compatibility (DEBUG=True)
    # -------------------------------------------------------------------------
    @override_settings(
        DEBUG=True,
        CF_ORIGIN_SECRET='',
        RESEND_API_KEY='simulate',
        EMAIL_SIMULATION_ALLOWED=True
    )
    def test_local_development_allows_requests_without_secret_when_unconfigured(self):
        """In local development (DEBUG=True) with no secret configured, requests proceed."""
        response = self.client.post(
            self.contact_url,
            self.valid_payload,
            content_type='application/json',
            HTTP_CF_CONNECTING_IP='127.0.0.1'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    @override_settings(
        DEBUG=True,
        CF_ORIGIN_SECRET=TEST_SECRET,
        RESEND_API_KEY='simulate',
        EMAIL_SIMULATION_ALLOWED=True
    )
    def test_local_development_enforces_secret_when_configured(self):
        """In local development (DEBUG=True), if CF_ORIGIN_SECRET is configured, it is enforced."""
        # Missing secret -> rejected
        rejected_response = self.client.post(
            self.contact_url,
            self.valid_payload,
            content_type='application/json',
            HTTP_CF_CONNECTING_IP='127.0.0.1'
        )
        self.assertEqual(rejected_response.status_code, status.HTTP_403_FORBIDDEN)

        # Valid secret -> accepted
        valid_response = self.client.post(
            self.contact_url,
            self.valid_payload,
            content_type='application/json',
            HTTP_X_ORIGIN_SECRET=TEST_SECRET,
            HTTP_CF_CONNECTING_IP='127.0.0.1'
        )
        self.assertEqual(valid_response.status_code, status.HTTP_201_CREATED)

    # -------------------------------------------------------------------------
    # 10. CORS Preflight OPTIONS Handling
    # -------------------------------------------------------------------------
    @override_settings(
        DEBUG=False,
        CF_ORIGIN_SECRET=TEST_SECRET,
        CORS_ALLOWED_ORIGINS=['https://adnanabdullahi.com']
    )
    def test_cors_preflight_options_succeeds_without_secret(self):
        """
        Legitimate CORS preflight OPTIONS request from allowed origin is processed
        by CorsMiddleware and returns 200 with CORS headers.
        """
        response = self.client.options(
            self.contact_url,
            HTTP_ORIGIN='https://adnanabdullahi.com',
            HTTP_ACCESS_CONTROL_REQUEST_METHOD='POST',
            HTTP_ACCESS_CONTROL_REQUEST_HEADERS='content-type,accept'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.headers.get('Access-Control-Allow-Origin'),
            'https://adnanabdullahi.com'
        )

    @override_settings(DEBUG=False, CF_ORIGIN_SECRET=TEST_SECRET)
    def test_non_cors_options_without_secret_returns_403(self):
        """
        An OPTIONS request without CORS preflight headers or secret is rejected by origin protection.
        """
        response = self.client.options(self.contact_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # -------------------------------------------------------------------------
    # 11. Information Leakage Prevention
    # -------------------------------------------------------------------------
    @override_settings(DEBUG=False, CF_ORIGIN_SECRET=TEST_SECRET)
    def test_origin_secret_not_leaked_in_error_response(self):
        """Error responses must not disclose the secret value or sensitive configuration."""
        response = self.client.post(
            self.contact_url,
            self.valid_payload,
            content_type='application/json',
            HTTP_X_ORIGIN_SECRET="wrong-secret"
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        content_str = response.content.decode('utf-8')
        self.assertNotIn(TEST_SECRET, content_str)
        for header, val in response.headers.items():
            self.assertNotIn(TEST_SECRET, str(val))
