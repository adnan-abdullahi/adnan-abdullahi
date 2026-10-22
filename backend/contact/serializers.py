"""
Serializers for contact submissions.
Implements strict validation, newline rejection, and honeypot field handling.
Conforms to docs/CONTACT-BACKEND-SPECIFICATION.md Section 5.
"""
from rest_framework import serializers


class ContactSubmissionSerializer(serializers.Serializer):
    """
    Serializer for visitor contact submissions via POST /api/contact/.
    """
    name = serializers.CharField(
        max_length=100,
        required=True,
        allow_blank=False,
        trim_whitespace=True,
        error_messages={
            'required': 'This field may not be blank.',
            'blank': 'This field may not be blank.',
            'max_length': 'Ensure this field has no more than 100 characters.',
        }
    )
    email = serializers.EmailField(
        max_length=254,
        required=True,
        allow_blank=False,
        error_messages={
            'required': 'This field may not be blank.',
            'blank': 'This field may not be blank.',
            'invalid': 'Enter a valid email address.',
            'max_length': 'Ensure this field has no more than 254 characters.',
        }
    )
    message = serializers.CharField(
        max_length=5000,
        required=True,
        allow_blank=False,
        trim_whitespace=True,
        error_messages={
            'required': 'This field may not be blank.',
            'blank': 'This field may not be blank.',
            'max_length': 'Ensure this field has no more than 5000 characters.',
        }
    )
    website = serializers.CharField(
        required=False,
        allow_blank=True,
        default='',
        write_only=True,
        help_text="Honeypot field: must remain empty for legitimate human visitors."
    )

    def validate_name(self, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise serializers.ValidationError("This field may not be blank.")
        if any(char in stripped for char in ('\r', '\n')):
            raise serializers.ValidationError("Name cannot contain newline characters.")
        return stripped

    def validate_email(self, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise serializers.ValidationError("This field may not be blank.")
        if any(char in stripped for char in ('\r', '\n')):
            raise serializers.ValidationError("Email address cannot contain newline characters.")
        return stripped.lower()

    def validate_message(self, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise serializers.ValidationError("This field may not be blank.")
        return stripped

