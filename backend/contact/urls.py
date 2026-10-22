"""
URL routing for the contact application.
"""
from django.urls import path
from contact.views import ContactAPIView

urlpatterns = [
    path('', ContactAPIView.as_view(), name='contact-submit'),
]

