# School TV Control System

A centralized digital notice management system that allows school administrators to display notices on multiple TVs across the campus from a single computer.

## 🎥 Demo

➡️ **[Watch the Version 1 MVP Demo(currently not available)]()**

## Version

**Current Version:** Version 2 — Fully Web-Based ✅

## Features Implemented

* ✅ Flask server for centralized notice management
* ✅ Health endpoint (`/`)
* ✅ `GET /get_notice` API to retrieve the latest notice
* ✅ `POST /update_notice` API to update the current notice
* ✅ Web-based VP admin page (`/admin`)
* ✅ Web-based TV display page (`/display`)
* ✅ Multi-line notice editor
* ✅ Notice validation (prevents empty notices)
* ✅ Status messages for successful or failed operations
* ✅ Automatic "Last Sent" timestamp
* ✅ Full-screen TV display in browser (F11 on receiver device)
* ✅ Automatic notice polling every 5 seconds
* ✅ Updates display only when the notice changes
* ✅ Offline detection when server becomes unavailable
* ✅ Automatic reconnection when server returns
* ✅ Configurable receiver using JSON configuration
* ✅ End-to-end communication between administrator, server and TV receiver
* ✅ Successfully demonstrated on a real LG TV via HDMI
* ✅ **Fully web-based** — no Tkinter/Python GUI dependencies

## System Architecture

```text
Administrator Laptop
│
├── Flask Server
│   ├── /admin  (send notices via browser)
│   └── /display (TV view — open in any browser)
│
└─────────────── HTTP ───────────────┐
                                     │
                              Receiver Device
                              └── Browser → /display
                                     │
                                   HDMI
                                     │
                                     ▼
                                 Television
```

## Quick Start

1. Install dependencies: `pip install -r requirements.txt`
2. Start the server: `python server/server.py`
3. Open admin page: `http://<server-ip>:5000/admin`  
   Or run: `python Client/start_admin.py` (opens browser automatically)
4. Open TV display: `http://<server-ip>:5000/display`  
   Or run: `python Receiver/start_tv.py` (opens browser on the receiver machine)

## Configuration

The `Receiver/receiver_config.json` looks something like this:

```json
{
    "server_ip": "0.0.0.0",
    "port": 5000
}
```

* `"server_ip"` : `"0.0.0.0"` : This tells the Flask server to bind to all available network interfaces on the VP's computer. 
This is what makes the server accessible to every device on the same LAN (e.g., http://192.168.1.4:5000, http://10.0.0.5:5000, etc.).
If this were set to `"127.0.0.1"` or `"localhost"`, only the VP's own machine could access the admin/display pages.
* `"port"`: `5000`: Defines which port the Flask server listens on.


## Project Structure

```
School-TV-Control-System-main/
├── server/
│   ├── server.py              # Flask server (central hub)
│   ├── notice.txt             # Current notice text
│   ├── templates/
│   │   ├── admin.html         # Admin web interface
│   │   └── display.html       # TV display web interface
│   └── static/
│       ├── css/
│       │   ├── admin.css
│       │   └── display.css
│       └── js/
│           ├── admin.js
│           └── display.js
├── Client/
│   └── start_admin.py         # Launcher for admin page
├── Receiver/
│   ├── start_tv.py            # Launcher for TV display
│   └── receiver_config.json   # Shared configuration
├── Assets/
│   └── nath valley logo.png
├── requirements.txt
└── README.md
```

## Demonstration

Version 2 has been fully migrated to a web-based architecture:

- Administrator interface runs in any browser (`/admin`)
- TV display runs in any browser (`/display`)
- No Tkinter or Python GUI dependencies required
- Output displayed on LG TV through HDMI
- Live notice updates
- Offline detection
- Automatic reconnection

## Next Goals (Version 3)

* ⏳ Deploy receiver on Raspberry Pi
* ⏳ Connect receivers over the school LAN
* ⏳ Auto-start receiver on Raspberry Pi boot
* ⏳ Support multiple TVs simultaneously
* ⏳ Notice history and scheduling
