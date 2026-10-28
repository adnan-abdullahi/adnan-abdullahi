"""
URL configuration for portfolio backend.
Exposes /api/contact/ for contact inquiries and /api/health/ for process liveness checks.
"""
from django.urls import path, include
from contact.views import HealthCheckView

urlpatterns = [
    path('api/health/', HealthCheckView.as_view(), name='health-check'),
    path('api/contact/', include('contact.urls')),
]
