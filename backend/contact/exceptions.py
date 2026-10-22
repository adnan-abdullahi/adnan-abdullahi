"""
Custom exception handler conforming to docs/CONTACT-BACKEND-SPECIFICATION.md Section 5.3.
Standardizes error JSON structures for validation and rate limiting.
"""
from rest_framework.views import exception_handler
from rest_framework.exceptions import Throttled, ValidationError
from rest_framework.response import Response
from rest_framework import status


def contact_exception_handler(exc, context):
    """
    Custom exception handler providing structured responses matching the API specification.
    """
    # Call REST framework's default exception handler first to get the standard response.
    response = exception_handler(exc, context)

    if response is not None:
        if isinstance(exc, Throttled):
            custom_data = {
                "status": "error",
                "message": "Submission rate limit exceeded. Please wait a few moments before trying again."
            }
            response.data = custom_data
            if exc.wait is not None:
                response['Retry-After'] = str(int(exc.wait))
            return response

        if isinstance(exc, ValidationError):
            custom_data = {
                "status": "error",
                "errors": response.data
            }
            response.data = custom_data
            return response

    return response

