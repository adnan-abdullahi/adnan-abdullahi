"""
Rate throttling for the contact submission endpoint.
Restricts anonymous submissions to approximately 5 per hour per client IP.
Relies strictly on REMOTE_ADDR to prevent arbitrary forwarded-header spoofing.
"""
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
        Extract client IP strictly from REMOTE_ADDR.
        Do not trust arbitrary HTTP_X_FORWARDED_FOR headers without trusted reverse proxy.
        """
        return request.META.get('REMOTE_ADDR', '127.0.0.1')

