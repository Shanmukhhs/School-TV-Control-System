from functools import wraps
from datetime import datetime, timedelta, timezone
from pathlib import Path
import hmac
import json
import os

from flask import Flask, request, render_template, send_from_directory, session, redirect, jsonify

try:
    from dotenv import load_dotenv
except ImportError:
    load_dotenv = None

SERVER_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SERVER_DIR.parent
ASSETS_DIR = PROJECT_ROOT / "Assets"
NOTICE_FILE = SERVER_DIR / "notice.txt"

# Indian Standard Time (UTC + 5:30)
IST = timezone(timedelta(hours=5, minutes=30))

if load_dotenv is not None:
    load_dotenv(PROJECT_ROOT / ".env")
    load_dotenv(SERVER_DIR / ".env")


def get_required_secret(name, disallowed_values):
    value = os.environ.get(name, "").strip()
    if not value:
        raise RuntimeError(
            f"Missing required environment variable {name}. "
            "Copy .env.example to .env and set a private value."
        )
    if value.lower() in {item.lower() for item in disallowed_values}:
        raise RuntimeError(
            f"Environment variable {name} is still using an unsafe placeholder/old value. "
            "Replace it with a new private value before starting the server."
        )
    return value


def env_flag(name, default=False):
    value = os.environ.get(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def env_positive_int(name, default):
    value = os.environ.get(name, "").strip()
    if not value:
        return default
    try:
        parsed = int(value)
    except ValueError as exc:
        raise RuntimeError(f"Environment variable {name} must be a whole number.") from exc
    if parsed <= 0:
        raise RuntimeError(f"Environment variable {name} must be greater than zero.")
    return parsed


SECRET_KEY = get_required_secret("SECRET_KEY", {"change-me", "replace-me", "nathvalley-notice-system-2025"})
ADMIN_PASSWORD = get_required_secret("ADMIN_PASSWORD", {"change-me", "replace-me", "admin123"})

app = Flask(__name__)
app.config.update(
    SECRET_KEY=SECRET_KEY,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Strict",
    SESSION_COOKIE_SECURE=env_flag("SESSION_COOKIE_SECURE", default=False),
    PERMANENT_SESSION_LIFETIME=timedelta(hours=env_positive_int("ADMIN_SESSION_HOURS", 8)),
)

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


def read_notice_data():
    if not NOTICE_FILE.exists():
        return {"notice": "", "updated_at": ""}
    
    content = NOTICE_FILE.read_text(encoding="utf-8").strip()
    if not content:
        return {"notice": "", "updated_at": ""}
    
    try:
        # Try to read new JSON format
        data = json.loads(content)
        if "notice" in data and "updated_at" in data:
            return data
    except json.JSONDecodeError:
        # Fallback for old plain-text format
        pass
        
    return {"notice": content, "updated_at": ""}


def write_notice_data(notice_text):
    # Generate timestamp in IST
    timestamp = datetime.now(IST).strftime("%d-%m-%Y %I:%M %p IST")
    data = {"notice": notice_text, "updated_at": timestamp}
    NOTICE_FILE.write_text(json.dumps(data), encoding="utf-8")


@app.route("/")
def home():
    return "School TV Control Server Running"


@app.route("/admin/login", methods=["GET", "POST"])
def admin_login():
    if request.method == "POST":
        password = request.form.get("password", "")
        # Raghav's UTF-8 fix included here
        if hmac.compare_digest(password.encode("utf-8"), ADMIN_PASSWORD.encode("utf-8")):
            session.clear()
            session.permanent = True
            session["authenticated"] = True
            return redirect("/admin")
        return render_template("login.html", error="Wrong password")
    return render_template("login.html", error=None)


@app.route("/admin/logout")
@require_auth
def admin_logout():
    # Raghav's logout feature included here
    session.clear()
    return redirect("/admin/login")


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
    data = read_notice_data()
    response = jsonify(data)
    # Prevent browser caching
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response


@app.route("/update_notice", methods=["POST"])
@require_auth
def update_notice():
    notice = request.form.get("notice", "")
    if not notice.strip():
        return ("Error: Notice cannot be empty", 400)
    write_notice_data(notice.strip())
    return "Success"


if __name__ == "__main__":
    display_ip = SERVER_IP if SERVER_IP != "0.0.0.0" else "127.0.0.1"
    print(f"Starting server on {SERVER_IP}:{PORT}")
    print(f"Admin panel: http://{display_ip}:{PORT}/admin")
    print(f"Display page: http://{display_ip}:{PORT}/display")
    
    try:
        from waitress import serve
        print("Running with Waitress (production mode)")
        serve(app, host=SERVER_IP, port=PORT, threads=4)
    except ImportError:
        print("Waitress not found. Running with Flask dev server (NOT for production)")
        print("Install waitress with: pip install waitress")
        app.run(host=SERVER_IP, port=PORT, debug=False)