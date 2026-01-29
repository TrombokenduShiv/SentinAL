import requests
import json

# The Target Endpoint
url = "http://127.0.0.1:8000/api/report/"

# The Malicious Payload to Simulate a Territory Breach Violation
payload = {
    "scraped_data": {
        "url": "http://123movies.to/avengers-leaked",
        "page_title": "Avengers: Endgame Full Movie HD Free",
        "video_duration_seconds": 10800,
        "uploader_name": "PirateKing99",
        "upload_date": "2026-01-28",
        # We simulate a "RU" (Russia) location to trigger the Territory Breach
        "server_location_code": "RU",
        "detected_keywords": ["leaked", "free stream"],
        # A fake hash to prove chain-of-custody
        "html_hash": "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e"
    }
}

print(f"[*] Launching Attack on {url}...")

try:
    # Send the POST request
    response = requests.post(url, json=payload)
    
    # Check the result
    if response.status_code == 201:
        print("\n[+] Violation Logged.")
        print("Server Response:")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"\n[-] FAILED. Status Code: {response.status_code}")
        print("Error Details:")
        print(response.text)

except Exception as e:
    print(f"\n[!] CONNECTION ERROR: {e}")
    print("Make sure the Django server is running (python manage.py runserver)")