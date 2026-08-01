from flask import Flask, request, render_template, send_from_directory
from pathlib import Path
import json

app = Flask(__name__)

SERVER_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SERVER_DIR.parent
ASSETS_DIR = PROJECT_ROOT / "Assets"
NOTICE_FILE = SERVER_DIR / "notice.txt"

# Load config from Receiver directory (shared config)
CONFIG_PATH = PROJECT_ROOT / "Receiver" / "receiver_config.json"
if CONFIG_PATH.exists():
    with open(CONFIG_PATH, "r") as f:
        config = json.load(f)
    SERVER_IP = config.get("server_ip", "0.0.0.0")
    PORT = config.get("port", 5000)
    API_KEY = config.get("api_key")  # optional: set to a string to require Authorization
else:
    SERVER_IP = "0.0.0.0"
    PORT = 5000
    API_KEY = None


@app.route("/")
def home():
    return "School TV Control Server Running"


@app.route("/admin")
def admin_page():
    # Pass API key to the admin template so admin UI can include it when sending updates.
    # If API_KEY is None, the admin UI will not include an Authorization header.
    return render_template("admin.html", api_key=API_KEY or "")


@app.route("/display")
def display_page():
    return render_template("display.html")


@app.route("/assets/<path:filename>")
def serve_asset(filename):
    if not ASSETS_DIR.exists():
        return ("Asset not found", 404)
    return send_from_directory(ASSETS_DIR, filename)


@app.route("/get_notice")
def get_notice():
    if not NOTICE_FILE.exists():
        return ""
    return NOTICE_FILE.read_text(encoding="utf-8")


@app.route("/update_notice", methods=["POST"])
def update_notice():
    # If API_KEY is set in config, require a Bearer token in the Authorization header.
    if API_KEY:
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return ("Unauthorized: missing or invalid Authorization header", 401)
        token = auth_header.split(" ", 1)[1]
        if token != API_KEY:
            return ("Unauthorized: invalid API key", 401)

    notice = request.form.get("notice", "")

    if not notice.strip():
        return ("Error: Notice cannot be empty", 400)

    NOTICE_FILE.write_text(notice, encoding="utf-8")
    return "Success"


if __name__ == "__main__":
    print(f"Starting server on {SERVER_IP}:{PORT}")
    app.run(host=SERVER_IP, port=PORT)