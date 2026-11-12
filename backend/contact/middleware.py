"""
Cloudflare origin secret verification middleware.

Protects the Render Django backend from direct origin bypass by verifying
the X-Origin-Secret header injected by Cloudflare Request Header Transform Rules.
Fails closed in production if unconfigured or mismatched, exempting only
GET and HEAD requests to the internal liveness health probe (/api/health/).
Supports safe zero-downtime secret rotation via comma-separated candidate secrets.
"""
import hmac
import logging
from django.conf import settings
from django.http import JsonResponse

logger = logging.getLogger(__name__)


class CloudflareOriginSecretMiddleware:
    """
    Middleware to enforce origin verification via Cloudflare shared secret.

    Security Architecture:
    - Production (DEBUG=False):
      - CF_ORIGIN_SECRET must be configured with one or more valid non-empty secrets
        (comma-separated). If unconfigured or containing only empty entries,
        fails safe/closed with HTTP 403 Forbidden.
      - Inbound requests must supply an X-Origin-Secret header matching at least
        one configured secret candidate.
      - Comparison evaluates every configured candidate using constant-time
        hmac.compare_digest() without short-circuiting to mitigate timing analysis attacks.
      - Missing, blank, or mismatching secrets return HTTP 403 Forbidden.
    - Local Development (DEBUG=True):
      - If CF_ORIGIN_SECRET is unset, empty, or whitespace-only, requests are permitted
        to proceed for local developer ergonomics and offline testing.
      - If CF_ORIGIN_SECRET is configured, verification is strictly enforced.
    - Health Check Exemption (LOW-01):
      - Narrowly exempts GET and HEAD requests to /api/health and /api/health/ to allow
        Render's internal liveness probe to verify process responsiveness without
        requiring Cloudflare credentials.
      - Unsupported methods (POST, PUT, PATCH, DELETE) to the health endpoint require
        a valid origin secret; without a secret they are rejected with HTTP 403 by this
        middleware, and with a secret they receive HTTP 405 from downstream DRF handling.
    - Secret Rotation Procedure (LOW-02):
      - 1. Render and Cloudflare initially run with the active secret.
      - 2. During rotation, configure both new and old secrets on Render:
           CF_ORIGIN_SECRET="new_secret,old_secret".
      - 3. Update the Cloudflare Transform Rule to inject the new secret.
      - 4. Verify traffic succeeds using the new secret.
      - 5. Remove the old secret from Render: CF_ORIGIN_SECRET="new_secret".
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # 1. Narrow health check exemption for hosting platform liveness probe (GET and HEAD only)
        path = (request.path_info or request.path or '').rstrip('/')
        if path == '/api/health' and request.method in ('GET', 'HEAD'):
            return self.get_response(request)

        # 2. Retrieve expected secret candidate(s) from Django settings
        raw_expected = getattr(settings, 'CF_ORIGIN_SECRET', '')
        if isinstance(raw_expected, (list, tuple)):
            candidates = [str(s).strip() for s in raw_expected if str(s).strip()]
        elif isinstance(raw_expected, str):
            candidates = [s.strip() for s in raw_expected.split(',') if s.strip()]
        else:
            candidates = []

        is_debug = getattr(settings, 'DEBUG', False)

        # 3. Fail-closed validation for unconfigured production deployments
        if not candidates:
            if not is_debug:
                logger.error(
                    "Origin protection failure: CF_ORIGIN_SECRET is not configured in production (DEBUG=False)."
                )
                return JsonResponse(
                    {
                        "status": "error",
                        "message": "Origin secret verification is not configured."
                    },
                    status=403
                )
            # Local development fallback when no secret is configured
            return self.get_response(request)

        # 4. Extract provided secret from request headers
        provided_secret = request.headers.get('x-origin-secret') or request.META.get('HTTP_X_ORIGIN_SECRET', '')
        if not isinstance(provided_secret, str):
            provided_secret = str(provided_secret)
        provided_secret = provided_secret.strip()

        # 5. Constant-time validation across all candidate secrets (no short-circuiting)
        if not provided_secret:
            logger.warning(
                "Origin protection rejection: Missing or empty origin secret for path %s.",
                request.path
            )
            return JsonResponse(
                {
                    "status": "error",
                    "message": "Invalid or missing origin secret."
                },
                status=403
            )

        # Evaluate every configured candidate secret using constant-time comparison
        # Avoid short-circuit evaluation to prevent timing analysis on candidate count / position
        matches = [hmac.compare_digest(provided_secret, candidate) for candidate in candidates]
        if not any(matches):
            logger.warning(
                "Origin protection rejection: Missing or invalid origin secret for path %s.",
                request.path
            )
            return JsonResponse(
                {
                    "status": "error",
                    "message": "Invalid or missing origin secret."
                },
                status=403
            )

        return self.get_response(request)
