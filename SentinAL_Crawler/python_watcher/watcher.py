from telethon import TelegramClient, events
import requests
import json
import asyncio

# --- CONFIGURATION ---
# You get these from https://my.telegram.org
API_ID = 'YOUR_API_ID_HERE'
API_HASH = 'YOUR_API_HASH_HERE'
CHANNEL_TO_WATCH = 'test_piracy_channel' # The username of the channel
CORE_API_URL = 'http://localhost:8000/api/report/'

# Initialize the Client
client = TelegramClient('sentinal_session', API_ID, API_HASH)

print("[-] Sentinel Watcher (Telegram Module) is listening...")

@client.on(events.NewMessage(chats=CHANNEL_TO_WATCH))
async def handler(event):
    message_text = event.raw_text
    
    # Simple Keyword Detection (The "Patrol" Phase)
    if "http" in message_text or "leaked" in message_text.lower():
        print(f"[!] PIRACY DETECTED in Telegram: {message_text}")
        
        # Prepare the payload for Trombokendu's API
        payload = {
            "title": "Telegram Leak Detected",
            "url": "Telegram Channel: " + CHANNEL_TO_WATCH,
            "uploader": "Anonymous_Telegram_User",
            "detected_location": "Global (Dark Web)",
            "timestamp": str(event.date),
            "status": "DETECTED"
        }

        # Send to Django Backend
        try:
            response = requests.post(CORE_API_URL, json=payload)
            if response.status_code == 200:
                print("[+] Reported to Core Engine.")
            else:
                print(f"[-] Report Failed: {response.status_code}")
        except Exception as e:
            print(f"[-] Backend Connection Error: {e}")

# Start the client
with client:
    client.run_until_disconnected()