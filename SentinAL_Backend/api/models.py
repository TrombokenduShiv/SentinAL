from django.db import models

class Contract(models.Model):
    """
    Stores the 'Rules of Engagement' extracted from PDF contracts.
    """
    title = models.CharField(max_length=255)
    # Storing country codes as "IN,US" (Comma Separated) for simple logic checks
    allowed_territory = models.TextField(help_text="Comma-separated codes (e.g. IN,US)")
    expiry_date = models.DateField()
    # The actual PDF file (for the Demo upload)
    pdf_file = models.FileField(upload_to='contracts/', null=True, blank=True)

    def __str__(self):
        return self.title

class Violation(models.Model):
    """
    Stores the 'Crimes' detected by the Crawler.
    """
    STATUS_CHOICES = [('OPEN', 'Open'), ('RESOLVED', 'Resolved')]
    BREACH_CHOICES = [('PIRACY', 'Piracy (Unauthorized Site)'), ('TERRITORY', 'Territory Breach')]

    # Metadata from the Crawler
    asset_name = models.CharField(max_length=255) # Derived from page_title
    url = models.URLField(max_length=500)
    location = models.CharField(max_length=10) # e.g. "RU", "CN"
    
    # System fields
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='OPEN')
    breach_type = models.CharField(max_length=20, choices=BREACH_CHOICES, null=True, blank=True)
    
    # CRITICAL: The Evidence Chain (Roadmap Day 2 Task)
    # Stores the SHA-256 hash of the scraped HTML to prove no tampering in court.
    html_hash = models.CharField(max_length=256, null=True, blank=True) 

    def __str__(self):
        return f"{self.asset_name} - {self.location}"