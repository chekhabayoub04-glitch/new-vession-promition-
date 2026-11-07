"""python3 tools/serve.py  →  http://localhost:8765/

Local preview server for HOTEL YOUCEF — threaded, with a deep accept queue (the home page asks for ~150 files at once;
`python3 -m http.server` keeps only 5 waiting connections and drops the rest, which leaves sections empty),
and no caching (every reload shows the latest build)."""
import functools, os
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # the site folder


class Handler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, '.js': 'text/javascript', '.mjs': 'text/javascript', '.webp': 'image/webp',
                      '.avif': 'image/avif', '.woff2': 'font/woff2', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml'}

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def log_message(self, *a):
        pass


class Server(ThreadingHTTPServer):
    request_queue_size = 256
    daemon_threads = True
    allow_reuse_address = True


if __name__ == '__main__':
    print('HOTEL YOUCEF → http://localhost:8765/')
    Server(('', 8765), functools.partial(Handler, directory=ROOT)).serve_forever()
