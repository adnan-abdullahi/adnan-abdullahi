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
