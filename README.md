# School TV Control System

A centralized digital notice management system that allows school administrators to display notices on multiple TVs across the campus from a single computer.

## 🎥 Demo

➡️ **[Watch the Version 1 MVP Demo](https://drive.google.com/file/d/1Ti24mn8l3MHF61dEPDj9c6kjnVPeBxXE/view?usp=sharing)**

## Version

**Current Version:** Version 1 MVP ✅

## Features Implemented

* ✅ Flask server for centralized notice management
* ✅ Health endpoint (`/`)
* ✅ `GET /get_notice` API to retrieve the latest notice
* ✅ `POST /update_notice` API to update the current notice
* ✅ Desktop VP application built with Tkinter
* ✅ Multi-line notice editor
* ✅ Notice validation (prevents empty notices)
* ✅ Status messages for successful or failed operations
* ✅ Automatic "Last Sent" timestamp
* ✅ Full-screen TV receiver application
* ✅ Automatic notice polling every 5 seconds
* ✅ Updates display only when the notice changes
* ✅ Offline detection when server becomes unavailable
* ✅ Automatic reconnection when server returns
* ✅ Configurable receiver using JSON configuration
* ✅ End-to-end communication between administrator, server and TV receiver
* ✅ Successfully demonstrated on a real LG TV via HDMI

## Current System Architecture

```text
Administrator Laptop
│
├── VP GUI
├── Flask Server
│
└─────────────── HTTP ───────────────┐
                                     │
                              Receiver Device
                              ├── start_tv.py
                              └── tv_display.py
                                     │
                                   HDMI
                                     │
                                     ▼
                                 Television
```

## Demonstration

Version 1 MVP has been successfully demonstrated on a real television.

Current demonstration setup:

- Administrator interface running on laptop
- Receiver running on laptop
- Output displayed on LG TV through HDMI
- Live notice updates
- Offline detection
- Automatic reconnection

## Next Goals (Version 2)

* ⏳ Deploy receiver on Raspberry Pi
* ⏳ Connect receivers over the school LAN
* ⏳ Auto-start receiver on Raspberry Pi boot
* ⏳ Support multiple TVs simultaneously