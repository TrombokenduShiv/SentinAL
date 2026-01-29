import http.server
import socketserver
import json

PORT = 8000

class RequestHandler(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/report/':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                
                # --- THE FIX IS HERE ---
                # We tell Python to look for 'detected_location' (what Java sends)
                target = data.get('title', 'Unknown Target')
                url = data.get('url', 'Unknown URL')
                
                # Try getting 'detected_location' first, otherwise 'region', otherwise 'UNKNOWN'
                region = data.get('detected_location') or data.get('region') or "UNKNOWN"
                # -----------------------

                print("\n[+] INTELLIGENCE RECEIVED FROM WEB")
                print("========================================")
                print(f"  TARGET:  {target}")
                print(f"  URL:     {url}")
                print(f"  REGION:  {region}")
                print("  RISK:    CRITICAL")
                print("========================================")

                self.send_response(200)
                self.end_headers()
                
            except Exception as e:
                print(f"[-] Error parsing data: {e}")
                self.send_response(400)
                self.end_headers()
        else:
            self.send_response(404)
            self.end_headers()

print(f"[*] SENTINAL CENTRAL COMMAND ONLINE (Port {PORT})...")
# Prevent "Address already in use" errors
socketserver.TCPServer.allow_reuse_address = True
httpd = socketserver.TCPServer(("", PORT), RequestHandler)

try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print("\n[-] Server shutting down.")
    httpd.server_close()