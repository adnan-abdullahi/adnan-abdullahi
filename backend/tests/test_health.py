"""
Unit tests for the process liveness health endpoint (GET /api/health/).
Verifies status 200 OK, JSON content type, exact payload, anonymous access,
zero database queries, rejection of unsupported HTTP methods (405),
and absence of sensitive diagnostics.
"""
from django.test import override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class HealthCheckEndpointTests(APITestCase):
    """
    Test suite for the GET /api/health/ liveness probe.
    """

    def setUp(self):
        super().setUp()
        self.url = reverse('health-check')

    def test_health_url_reverse_resolution(self):
        """Named route 'health-check' resolves to '/api/health/'."""
        self.assertEqual(self.url, '/api/health/')

    def test_health_returns_200_and_json_content_type(self):
        """GET /api/health/ returns HTTP 200 OK with application/json and exact payload."""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('application/json', response.headers.get('Content-Type', ''))
        self.assertEqual(response.json(), {"status": "healthy"})

    def test_health_allows_anonymous_access(self):
        """Endpoint is unauthenticated to support hosting platform health probes."""
        # Client makes request without any authorization credentials or session
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_health_executes_zero_database_queries(self):
        """Liveness check must not query the database."""
        with self.assertNumQueries(0):
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    @override_settings(CF_ORIGIN_SECRET='test-health-secret')
    def test_health_rejects_unsupported_methods_with_valid_secret(self):
        """Methods other than GET/HEAD with valid origin secret pass middleware and return HTTP 405."""
        unsupported_methods = ['post', 'put', 'patch', 'delete']
        for method in unsupported_methods:
            client_method = getattr(self.client, method)
            response = client_method(
                self.url,
                data={},
                format='json',
                HTTP_X_ORIGIN_SECRET='test-health-secret'
            )
            self.assertEqual(
                response.status_code,
                status.HTTP_405_METHOD_NOT_ALLOWED,
                f"Expected HTTP 405 for method {method.upper()} with secret, got {response.status_code}"
            )

    @override_settings(CF_ORIGIN_SECRET='test-health-secret')
    def test_health_rejects_unsupported_methods_without_secret_with_403(self):
        """Methods other than GET/HEAD without origin secret are rejected with HTTP 403."""
        unsupported_methods = ['post', 'put', 'patch', 'delete']
        for method in unsupported_methods:
            client_method = getattr(self.client, method)
            response = client_method(self.url, data={}, format='json')
            self.assertEqual(
                response.status_code,
                status.HTTP_403_FORBIDDEN,
                f"Expected HTTP 403 for method {method.upper()} without secret, got {response.status_code}"
            )

    def test_health_head_method_exempt_without_secret(self):
        """HEAD /api/health/ succeeds with HTTP 200 without requiring X-Origin-Secret."""
        response = self.client.head(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_health_contains_no_sensitive_diagnostics(self):
        """Response payload must only contain the status key and no sensitive data."""
        response = self.client.get(self.url)
        data = response.json()
        self.assertEqual(set(data.keys()), {"status"})
        self.assertEqual(data["status"], "healthy")
        disallowed_keys = [
            "database", "db", "host", "port", "user", "password", "secret",
            "debug", "env", "settings", "traceback", "exception", "error"
        ]
        for key in disallowed_keys:
            self.assertNotIn(key, data)

    def test_health_exempt_from_rate_throttling(self):
        """Health check endpoint is exempt from rate throttling and never returns HTTP 429."""
        for _ in range(10):
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.json(), {"status": "healthy"})

    @override_settings(DEBUG=False, CF_ORIGIN_SECRET='prod-secret', ALLOWED_HOSTS=['api.adnanabdullahi.com'])
    def test_health_without_either_cloudflare_header_returns_200_in_production(self):
        """
        GET /api/health/ returns HTTP 200 in production without requiring either
        CF-Connecting-IP or X-Origin-Secret header.
        """
        # Ensure client has neither Cloudflare header
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {"status": "healthy"})
        self.assertIn('application/json', response.headers.get('Content-Type', ''))

    @override_settings(DEBUG=False, CF_ORIGIN_SECRET='prod-secret', ALLOWED_HOSTS=['api.adnanabdullahi.com'])
    def test_health_head_without_either_cloudflare_header_accepted_in_production(self):
        """
        HEAD /api/health/ returns HTTP 200 with empty body in production without
        requiring either CF-Connecting-IP or X-Origin-Secret header.
        """
        response = self.client.head(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content, b'')

    @override_settings(DEBUG=False, CF_ORIGIN_SECRET='prod-secret', ALLOWED_HOSTS=['api.adnanabdullahi.com'])
    def test_health_without_trailing_slash_returns_200(self):
        """GET /api/health without trailing slash returns HTTP 200 directly."""
        response = self.client.get('/api/health')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {"status": "healthy"})

    @override_settings(DEBUG=False, CF_ORIGIN_SECRET='prod-secret', ALLOWED_HOSTS=['api.adnanabdullahi.com'])
    def test_health_succeeds_with_unregistered_render_infrastructure_host_headers(self):
        """
        Render platform health checks probe container instances directly with internal
        hostnames or IP addresses (e.g. *.onrender.com, 10.x.x.x, 0.0.0.0).
        The health check must return HTTP 200 without being blocked by Django ALLOWED_HOSTS.
        """
        infrastructure_hosts = [
            'service-backend.onrender.com',
            '10.244.0.15:10000',
            '0.0.0.0:10000',
            'localhost:10000',
        ]
        for host in infrastructure_hosts:
            response = self.client.get(self.url, HTTP_HOST=host)
            self.assertEqual(
                response.status_code,
                status.HTTP_200_OK,
                f"Health check failed with status {response.status_code} for infrastructure host '{host}'"
            )
            self.assertEqual(response.json(), {"status": "healthy"})

    @override_settings(DEBUG=False, CF_ORIGIN_SECRET='prod-secret', ALLOWED_HOSTS=['api.adnanabdullahi.com'])
    def test_normal_production_contact_without_origin_secret_remains_rejected_403(self):
        """Ordinary production requests to /api/contact/ without origin secret remain rejected with HTTP 403."""
        contact_url = reverse('contact-submit')
        response = self.client.post(
            contact_url,
            data={'name': 'Jane Doe', 'email': 'jane@example.com', 'message': 'Hello'},
            format='json',
            HTTP_CF_CONNECTING_IP='203.0.113.195'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    @override_settings(DEBUG=False, CF_ORIGIN_SECRET='prod-secret', ALLOWED_HOSTS=['api.adnanabdullahi.com'])
    def test_normal_production_contact_without_valid_cf_connecting_ip_remains_rejected_400(self):
        """Ordinary production requests with valid origin secret but without CF-Connecting-IP are rejected with HTTP 400."""
        contact_url = reverse('contact-submit')
        response = self.client.post(
            contact_url,
            data={'name': 'Jane Doe', 'email': 'jane@example.com', 'message': 'Hello'},
            format='json',
            HTTP_HOST='api.adnanabdullahi.com',
            HTTP_X_ORIGIN_SECRET='prod-secret'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = response.json()
        self.assertIn('Missing required CF-Connecting-IP header.', data['errors']['network'])
