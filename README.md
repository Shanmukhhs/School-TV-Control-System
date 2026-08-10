# School TV Control System

A reliable, centralized digital notice management system that allows school administrators to display announcements on multiple TVs across the campus from a single computer. Designed for large campuses with distributed buildings.

## 🎥 Demo

➡️ **[Watch the Version 3 — Fully Web-Based Demo Video](https://drive.google.com/file/d/1OEq-8gNx8BgbtEfOIYGgZZHT2tgnrQj2/view?usp=drive_link)**

## Version

**Current Version:** Version 3 — Production Ready & Secure ✅

* Version 1 — Desktop GUI (Tagged: `gui-version`)
* Version 2 — Fully Web-Based (Demo in link above)
* **Version 3 — Production Server, Offline Caching & Auth (Current)**

## Key Features

* ✅ **Production WSGI Server:** Runs on Waitress to handle concurrent requests from multiple TVs polling simultaneously.
* ✅ **Offline Caching:** If the network drops or the server restarts, displays automatically show the last cached notice instead of crashing to a browser error screen. Survives page refresh.
* ✅ **Admin Authentication:** Password-protected admin panel prevents unauthorized users from changing notices.
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
