# School TV Control System

A centralized digital notice management system that allows school administrators to display notices on multiple TVs across the campus from a single computer.

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
* ✅ Receiver application that polls the server every 5 seconds
* ✅ Receiver updates the display only when the notice changes
* ✅ End-to-end communication between the VP application, server, and receiver

## Current System Architecture

```text
VP GUI
   │
HTTP POST
   │
   ▼
Flask Server
   │
Updates notice.txt
   │
   ▼
Receiver
   │
HTTP GET (every 5 seconds)
   │
   ▼
TV Display
```

## Next Goals

* ⏳ Replace terminal output with a full-screen TV display
* ⏳ Deploy the receiver on Raspberry Pi
* ⏳ Connect Raspberry Pis over the school LAN
* ⏳ Automatically launch the receiver on Raspberry Pi startup
* ⏳ Deploy the system across multiple TVs in the school
