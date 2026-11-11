"""
Rate throttling for the contact submission endpoint.
Restricts anonymous submissions to approximately 5 per hour per client IP.

In production behind Cloudflare and Render reverse proxies (DEBUG=False),
visitor identity is extracted exclusively from the trusted CF-Connecting-IP
header, validated, and normalized to canonical IP representation.

In local development environments (DEBUG=True), visitor identity falls back
to REMOTE_ADDR (defaulting to 127.0.0.1) without inspecting forwarded headers.
"""
import ipaddress
from django.conf import settings
from rest_framework.exceptions import ValidationError
from rest_framework.throttling import AnonRateThrottle


class ContactAnonRateThrottle(AnonRateThrottle):
    """
    Throttle for anonymous contact form submissions.
    Rate: 5 requests per hour.
    """
    scope = 'contact_anon'
    rate = '5/hour'

    def get_ident(self, request):
        """
        Extract and validate client IP.

        In production (DEBUG=False):
        - Requires the trusted CF-Connecting-IP header provided by Cloudflare.
        - Fails closed with ValidationError (HTTP 400) if missing, blank,
          multi-valued, or malformed.
        - Canonicalizes IPv4 and IPv6 addresses via Python's standard ipaddress module.
        - Never falls back to REMOTE_ADDR or HTTP_X_FORWARDED_FOR.

        In local development (DEBUG=True):
        - Extracts and normalizes REMOTE_ADDR if present and valid.
        - Defaults safely to '127.0.0.1' without trusting forwarded headers.
        """
        if getattr(settings, 'DEBUG', False):
            remote_addr = (request.META.get('REMOTE_ADDR') or '').strip()
            if remote_addr:
                try:
                    return str(ipaddress.ip_address(remote_addr))
                except ValueError:
                    return '127.0.0.1'
            return '127.0.0.1'

        raw_ip = (request.META.get('HTTP_CF_CONNECTING_IP') or '').strip()
        if not raw_ip:
            raise ValidationError({'network': 'Missing required CF-Connecting-IP header.'})

        if ',' in raw_ip:
            raise ValidationError({'network': 'Multiple values in CF-Connecting-IP header are prohibited.'})

        try:
            parsed_ip = ipaddress.ip_address(raw_ip)
        except ValueError:
            raise ValidationError({'network': 'Malformed or invalid CF-Connecting-IP address.'})

        return str(parsed_ip)

