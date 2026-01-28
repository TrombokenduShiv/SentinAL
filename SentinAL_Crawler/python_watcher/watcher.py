import time
import json
import requests

# CONFIGURATION
API_ENDPOINT = "http://localhost:8000/api/report/"
PLATFORM = "Telegram"

def scan_telegram_channel():
    print(f"[*] Scanning {PLATFORM} channels for leaks...")
    time.sleep(2) # Fake processing time
    
    # SIMULATED FINDING
    # In the real world, this would use the Telegram API
    leak_found = {
        "title": "Avengers_Secret_Wars_LEAKED_CAM.mkv",
        "url": "http://t.me/pirate_bay_official/777",
        "uploader": "User_X99",
        "platform": PLATFORM,
        "risk_level": "HIGH"
    }
    
    print(f"[!] LEAK DETECTED: {leak_found['title']}")
    return leak_found

def report_leak(data):
    try:
        # In a real demo, we uncomment the next line to send to backend
        # response = requests.post(API_ENDPOINT, json=data)
        print(f"[+] Reporting to Sentinel Core... SUCCESS")
        print(f"[+] Payload: {json.dumps(data, indent=2)}")
    except Exception as e:
        print(f"[-] Connection Failed: {e}")

if __name__ == "__main__":
    while True:
        data = scan_telegram_channel()
        report_leak(data)
        print("[-] Sleeping for 10 seconds...")
        time.sleep(10)