import http.server
import os

# Custom request handler class to add Cache-Control headers
class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Set Cache-Control headers to disable caching
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == '__main__':
    # Define the directory to serve files from (current directory in this case)
    directory = os.getcwd()
    
    # Create and start the server on localhost:8000
    httpd = http.server.HTTPServer(('0.0.0.0', 8000), NoCacheHTTPRequestHandler)
    print(f"Serving on http://localhost:8000 with no cache control")
    httpd.serve_forever()
