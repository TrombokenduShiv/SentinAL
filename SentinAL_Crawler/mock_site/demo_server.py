from http.server import BaseHTTPRequestHandler, HTTPServer
import json

class DemoHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)
        
        print("\n" + "="*40)
        print(f"[+] INTELLIGENCE RECEIVED FROM {data.get('platform', 'WEB')}")
        print("="*40)
        print(f"  TARGET:  {data.get('title')}")
        print(f"  URL:     {data.get('url')}")
        print(f"  REGION:  {data.get('region', 'UNKNOWN')}")
        print(f"  RISK:    {data.get('risk_level', 'CRITICAL')}")
        print("="*40 + "\n")

        self.send_response(200)
        self.end_headers()
        self.wfile.write(b'{"status": "CONFIRMED"}')

if __name__ == "__main__":
    print("[*] SENTINAL CENTRAL COMMAND ONLINE (Port 8000)...")
    HTTPServer(('localhost', 8000), DemoHandler).serve_forever()
    