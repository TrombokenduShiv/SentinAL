from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from .models import Violation
from .serializers import ViolationSerializer, CrawlerReportSerializer
from ai_engine.fuzzy_matcher import identify_asset
from ai_engine.logic_gate import check_breach
from django.http import FileResponse
from ai_engine.gemini_client import draft_legal_notice
from utils.pdf_generator import generate_notice_pdf
from django.shortcuts import get_object_or_404

class ReportViolationView(APIView):
    def post(self, request):
        serializer = CrawlerReportSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data['scraped_data']
            
            # 1. THE MATCHMAKER: Identify the asset
            scraped_title = data.get('page_title', '')
            matched_contract = identify_asset(scraped_title)

            if not matched_contract:
                # If we can't identify the movie, log it as "Unknown" but don't crash
                print(f"[-] Unknown Asset: {scraped_title}")
                return Response({"status": "ignored_unknown_asset"}, status=status.HTTP_200_OK)

            # 2. THE JUDGE: Check for Breach
            scraped_location = data.get('server_location_code', 'UNKNOWN')
            verdict = check_breach(matched_contract, scraped_location)

            if verdict == "CLEAN":
                return Response({"status": "compliant_usage"}, status=status.HTTP_200_OK)

            # 3. THE EXECUTIONER: Log the Violation
            violation = Violation.objects.create(
                asset_name=matched_contract.title,
                url=data.get('url'),
                location=scraped_location,
                html_hash=data.get('html_hash', ''),
                breach_type=verdict, # "PIRACY" or "TERRITORY"
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

class EnforceViolationView(APIView):
    """
    POST /api/enforce/<id>/
    Triggers the Kill Switch:
    1. Generates Legal Text (Gemini)
    2. Creates PDF
    3. Returns PDF as download
    """
    def post(self, request, pk):
        # 1. Get the Violation
        violation = get_object_or_404(Violation, pk=pk)
        
        # 2. Prepare Data for AI
        violation_details = {
            "asset": violation.asset_name,
            "url": violation.url,
            "location": violation.location,
            "timestamp": str(violation.timestamp),
            "breach_type": violation.breach_type,
            "evidence_hash": violation.html_hash
        }

        # 3. Call AI Lawyer
        print(f"[*] Drafting Notice for Violation #{pk}...")
        legal_text = draft_legal_notice(violation_details)

        # 4. Generate PDF
        print(f"[*] Printing PDF...")
        pdf_path = generate_notice_pdf(pk, legal_text)

        # 5. Mark as Resolved
        violation.status = 'RESOLVED'
        violation.save()

        # 6. Return File
        return FileResponse(open(pdf_path, 'rb'), content_type='application/pdf')