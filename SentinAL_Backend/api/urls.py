from django.urls import path
from .views import EnforceViolationView, ReportViolationView, DashboardFeedView

urlpatterns = [
    # Endpoint for the Web Crawler
    path('report/', ReportViolationView.as_view(), name='report_violation'),
    
    # Endpoint for the React Frontend
    path('violations/', DashboardFeedView.as_view(), name='dashboard_feed'),

    # Endpoint to Enforce a Violation
    path('enforce/<int:pk>/', EnforceViolationView.as_view(), name='enforce_violation'),
]