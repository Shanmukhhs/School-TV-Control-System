# School TV Control System

A centralized digital notice management system that allows school administrators to display notices on multiple TVs across the campus from a single computer.

## 🎥 Demo

➡️ **[Watch the Version 2 — Fully Web-Based Demo Video](https://drive.google.com/file/d/1OlHCWpc9dg4tUG7Vy0DAjp_KplrAb89P/view?usp=sharing)**

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
* ✅ Successfully demonstrated on a real non-smart TV via HDMI
* ✅ **Fully web-based** — no Tkinter/Python GUI dependencies

## System Architecture

```text
                         ┌──────────────────────────────────────┐
                         │     Administrator Browser            │
                         │  /admin - Compose & Send Notices     │
                         └──────────────────┬───────────────────┘
                                            │
                                 HTTP POST /update_notice
                                            │
                                            ▼
          ┌─────────────────────────────────────────────────────────────┐
          │             Flask Server (Central Hub)                      │
          │                                                             │
          │  • REST API (GET/POST endpoints)                            │
          │  • Notice state management                                  │
          │  • Static file serving                                      │
          │  • Listening on Port 5000 (LAN)                             │
          └─────────────────────────┬───────────────────────────────────┘
                                    │
                       HTTP GET /get_notice (every 5 seconds)
                                    │
                                    ▼
                    ┌──────────────────────────────────────┐
                    │      Receiver Browser (Any Device)   │
                    │   /display - Full-screen Notice View │
                    │                                      │
                    │  • Auto-update on change             │
                    │  • Offline detection                 │
                    │  • Automatic reconnection            │
                    └──────────────────┬───────────────────┘
                                       │
                                   HDMI Output
                                       │
                                       ▼
                          ┌────────────────────────┐
                          │      Television        │
                          │   (Smart or Dumb TV)   │
                          └────────────────────────┘
```

## Quick Start

1. Install dependencies: `pip install -r requirements.txt`
2. Start the server: `cd ./server/ | python3 server.py`
3. Open admin page: `http://<your ipv4 address>:5000/admin`(you will see the address after running server.py)
4. Open TV display: `http://<your ipv4 address>:5000/display`

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
├── Receiver/
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
- Output displayed on dumb TV(non-smart TV) through HDMI
- Live notice updates
- Offline detection
- Automatic reconnection

## Next Goals (Version 3)

* ⏳ Deploy receiver on Raspberry Pi
* ⏳ Connect receivers over the school LAN
* ⏳ Auto-start receiver on Raspberry Pi boot
* ⏳ Support multiple TVs simultaneously
* ⏳ Notice history and scheduling
