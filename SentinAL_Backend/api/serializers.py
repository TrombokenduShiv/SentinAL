from rest_framework import serializers
from .models import Violation, Contract

class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = '__all__'

class ViolationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Violation
        fields = '__all__'

# SPECIAL SERIALIZER: For Alaukik's Crawler Payload
# This matches the specific JSON structure defined in the Tech Spec.
class CrawlerReportSerializer(serializers.Serializer):
    # Expects the nested object "scraped_data"
    scraped_data = serializers.JSONField()