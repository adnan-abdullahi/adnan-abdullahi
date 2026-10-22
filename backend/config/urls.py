"""
URL configuration for portfolio backend.
Exposes /api/contact/ for contact inquiries.
"""
from django.urls import path, include

urlpatterns = [
    path('api/contact/', include('contact.urls')),
]
