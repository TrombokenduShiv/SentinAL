from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from .models import Violation
from .serializers import ViolationSerializer, CrawlerReportSerializer

class ReportViolationView(APIView):
    """
    Endpoint for the Crawler (Alaukik) to report findings.
    Method: POST
    Payload: {"scraped_data": { ... }}
    """
    def post(self, request):
        # Validate the incoming structure using the specific Crawler Serializer
        serializer = CrawlerReportSerializer(data=request.data)
        if serializer.is_valid():
            # Extract the nested data
            data = serializer.validated_data['scraped_data']
            
            # --- SESSION 2 AI INTEGRATION POINT ---
            # TODO: 1. Call fuzzy_matcher.identify_asset(data['page_title'])
            # TODO: 2. Call logic_gate.check_breach(asset, data['location'])
            # --------------------------------------

            # SESSION 1 LOGIC: "The Pipe Test"
            # We assume everything is a violation just to verify connectivity.
            violation = Violation.objects.create(
                asset_name=data.get('page_title', 'Unknown Asset'),
                url=data.get('url'),
                location=data.get('server_location_code', 'UNKNOWN'), # Mapping JSON 'server_location_code' to Model 'location'
                html_hash=data.get('html_hash', ''),
                breach_type='PIRACY', # Default for Session 1
                status='OPEN'
            )
            
            return Response({
                "status": "violation_logged",
                "id": violation.id,
                "type": violation.breach_type
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DashboardFeedView(ListAPIView):
    """
    Endpoint for the Frontend to poll.
    Method: GET
    Returns: List of OPEN violations ordered by newest first.
    """
    queryset = Violation.objects.filter(status='OPEN').order_by('-timestamp')
    serializer_class = ViolationSerializer