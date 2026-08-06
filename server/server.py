from flask import Flask, request, render_template, send_from_directory, session, redirect
from pathlib import Path
import json
from functools import wraps

app = Flask(__name__)

app.secret_key = "nathvalley-notice-system-2025"
ADMIN_PASSWORD = "admin123"

SERVER_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SERVER_DIR.parent
ASSETS_DIR = PROJECT_ROOT / "Assets"
NOTICE_FILE = SERVER_DIR / "notice.txt"

CONFIG_PATH = PROJECT_ROOT / "Receiver" / "receiver_config.json"
if CONFIG_PATH.exists():
    with open(CONFIG_PATH, "r") as f:
        config = json.load(f)
    SERVER_IP = config.get("server_ip", "0.0.0.0")
    PORT = config.get("port", 5000)
else:
    SERVER_IP = "0.0.0.0"
    PORT = 5000


def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get("authenticated"):
            return redirect("/admin/login")
        return f(*args, **kwargs)
    return decorated_function


@app.route("/")
def home():
    return "School TV Control Server Running"


@app.route("/admin/login", methods=["GET", "POST"])
def admin_login():
    if request.method == "POST":
        password = request.form.get("password", "")
        if password == ADMIN_PASSWORD:
            session["authenticated"] = True
            return redirect("/admin")
        return render_template("login.html", error="Wrong password")
    return render_template("login.html", error=None)


@app.route("/admin")
@require_auth
def admin_page():
    return render_template("admin.html")


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
@require_auth
def update_notice():
    notice = request.form.get("notice", "")
    if not notice.strip():
        return ("Error: Notice cannot be empty", 400)
    NOTICE_FILE.write_text(notice, encoding="utf-8")
    return "Success"


if __name__ == "__main__":
    print(f"Starting server on {SERVER_IP}:{PORT}")
    print(f"Admin panel: http://{SERVER_IP}:{PORT}/admin")
    print(f"Display page: http://{SERVER_IP}:{PORT}/display")
    
    try:
        from waitress import serve
        print("Running with Waitress (production mode)")
        serve(app, host=SERVER_IP, port=PORT, threads=4)
    except ImportError:
        print("Waitress not found. Running with Flask dev server (NOT for production)")
        print("Install waitress with: pip install waitress")
        app.run(host=SERVER_IP, port=PORT, debug=True)