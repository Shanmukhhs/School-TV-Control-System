## Next Goals

* ⏳ Test the software on a real rasp node in school.

## Version History & Changelog

### 🔨 Unreleased / In Development

The current codebase is the result of an active migration from the original desktop MVP to a fully web-based architecture:

* **Fully Web-Based:** Migrated the administrator dashboard and TV receiver from the Tkinter desktop application to a browser-based interface, preserving all of the original functionality while removing the dependency on desktop GUI applications.
* **Production WSGI Server:** Switched to Waitress to handle concurrent requests from multiple TVs polling simultaneously.
* **Offline Caching:** Displays show the last cached notice during network drops or server restarts, surviving page refreshes.
* **Admin Authentication & Security:** Password-protected admin panel, local `.env` secrets, constant-time password comparison (`hmac.compare_digest`), session expiration, and secure cookie flags (`HTTPONLY`, `SAMESITE`).
* **One-Click Launcher:** `start_server.bat` sets the admin password, creates the Python environment on first run, starts the server, and opens the admin panel automatically.
* **Reliability Fixes:** Fixed a login crash on non-ASCII passwords, added `GET /admin/logout`, and improved the startup banner.

➡️ **[Watch the Web-Based Demo Video](https://drive.google.com/file/d/1OEq-8gNx8BgbtEfOIYGgZZHT2tgnrQj2/view?usp=drive_link)**

## Quick Start

### Easiest way (Windows)

Double-click **`start_server.bat`**. It will:

1. Ask you to choose an admin password (minimum 8 characters, confirmed twice).
2. Create the Python virtual environment and install dependencies on first run.
3. Save your settings to a local `.env` file (never committed).
4. Start the production server (Waitress) in its own window.
5. Open the admin panel at `http://127.0.0.1:5000/admin` in your default browser.

To stop the server, close the "School TV Server" window.

### Manual way

```powershell
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
copy .env.example .env    # then edit SECRET_KEY and ADMIN_PASSWORD
.venv\Scripts\python server\server.py
```

Then open `http://127.0.0.1:5000/admin` (admin) or `http://127.0.0.1:5000/display` (TV view).

## Features

* ✅ **One-Click Launcher:** `start_server.bat` handles environment setup, password configuration, server start, and opens the admin panel automatically.

* ✅ **Production WSGI Server:** Runs on Waitress to handle concurrent requests from multiple TVs polling simultaneously.
* ✅ **Offline Caching:** If the network drops or the server restarts, displays automatically show the last cached notice instead of crashing to a browser error screen. Survives page refresh.
* ✅ **Admin Authentication:** Password-protected admin panel prevents unauthorized users from changing notices.
* ✅ **Admin Logout:** One-click session termination from the admin panel.
* ✅ **Real-Time Connection Monitoring:** Displays show a green/red status indicator with cached data timestamps during outages.
* ✅ Flask server for centralized notice management
* ✅ Health endpoint (`/`)
* ✅ `GET /get_notice` API to retrieve the latest notice
* ✅ `POST /update_notice` API to update the current notice
* ✅ Web-based VP admin page (`/admin`)
* ✅ Web-based TV display page (`/display`)
* ✅ Multi-line notice editor with validation (prevents empty notices)
* ✅ Automatic "Last Sent" timestamp
* ✅ Full-screen TV display in browser (F11 on receiver device)
* ✅ Automatic notice polling every 5 seconds
* ✅ Updates display only when the notice changes
* ✅ Automatic reconnection when server returns
* ✅ Configurable receiver using JSON configuration
* ✅ End-to-end communication between administrator, server, and TV receiver
* ✅ Successfully demonstrated on a real non-smart TV via HDMI

## System Architecture

```text
Administrator Laptop
│
├── Waitress Production Server (Flask App)
│   ├── /admin/login  (secure authentication)
│   ├── /admin        (send notices via browser)
│   ├── /admin/logout (end the admin session)
│   └── /display      (TV view — open in any browser)
│
└─────────────── HTTP (LAN/Wi-Fi) ───────────┐
                                             │
                                      Receiver Device(s)
                                      └── Browser → /display
                                             │
                                           HDMI
                                             │
                                             ▼
                                         Television
Class 11, Nath Valley School
