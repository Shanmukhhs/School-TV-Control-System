# 📺 School TV Control System (Web)

A fully web-based, cloud-connected notice management system for Nath Valley School.
Administrators send text notices and event posters from any device, and every
connected TV updates within seconds.

➡️ [Watch the Web-Based Demo Video showcasing image/poster feature](https://drive.google.com/file/d/14yw1KgYRI0k5xfoUJ1GW8Pliclr1M5Tq/view?usp=sharing)

---

## ✅ Features

**Notices**
- ✅ Web-based admin panel (`/admin`) and TV display page (`/display`)
- ✅ Multi-line notice editor with validation (prevents empty notices)
- ✅ Line breaks preserved on the TV; text auto-sized & aligned by content
- ✅ Efficient 5-second polling — display updates only when something changes
- ✅ Server-generated **Indian Standard Time (IST, UTC+5:30)** timestamps

**Images / Posters**
- ✅ Upload posters & photos from the admin panel (PNG, JPG, JPEG, GIF, WEBP)
- ✅ Posters appear inside the notice-board frame on every TV
- ✅ Instant live swap — a new poster replaces the old one on all displays within 5 seconds
- ✅ One-click "Remove Image" returns to text notices

**Reliability**
- ✅ Production WSGI server (Waitress) handles many TVs polling simultaneously
- ✅ Offline caching — displays show the last cached notice during outages; survives refresh
- ✅ Cache-busting polls + server no-cache headers — TVs never show stale notices
- ✅ Real-time connection monitoring (🟢 Connected /  Offline) + automatic reconnection
- ✅ Full-screen TV display in any browser (F11 on the receiver device)

**Security**
- ✅ Password-protected admin panel with constant-time comparison (`hmac.compare_digest`)
- ✅ UTF-8-safe password handling (non-ASCII passwords supported)
- ✅ Session expiration + secure cookie flags (`HTTPONLY`, `SAMESITE`) + one-click logout
- ✅ Secrets live in a local `.env` file (never committed to Git)

**Deployment & Teamwork**
- ✅ Runs locally on a LAN *or* in the cloud (PythonAnywhere) with zero code changes
- ✅ One-click Windows launcher (`start_server.bat`)
- ✅ Professional Git workflow: feature branches → pull requests → peer review → merge

---

## 🚀 Quick Start

### Easiest way (Windows)
Double-click `start_server.bat`. It will:
- Ask you to choose an admin password (minimum 8 characters, confirmed twice).
- Create the Python virtual environment and install dependencies on first run.
- Save your settings to a local `.env` file (never committed).
- Start the production server (Waitress) in its own window.
- Open the admin panel at `http://127.0.0.1:5000/admin` in your default browser.

To stop the server, close the "School TV Server" window.

### Manual way
```
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
copy .env.example .env    # then edit SECRET_KEY and ADMIN_PASSWORD
.venv\Scripts\python server\server.py
```
Then open `http://127.0.0.1:5000/admin` (admin) or `http://127.0.0.1:5000/display` (TV view).

---

## ☁️ Cloud Deployment (PythonAnywhere)

The production instance serves the school TVs from PythonAnywhere, so notices can
be sent from anywhere (phone, home, staff room).

**Deploy workflow:**
1. Develop on a feature branch and push it to GitHub.
2. Open a **Pull Request** — a teammate reviews and approves it (branch protection requires at least 1 approval).
3. Merge into `main`.
4. On PythonAnywhere Bash: `cd ~/School-TV-Control-System && git pull origin main`
5. Click **Reload** on the Web tab. All TVs pick up the change within seconds.

---

## 🖼️ How Poster Mode Works

1. Admin uploads an image → the server saves it in `server/uploads/` and records its name plus a fresh IST timestamp in `server/notice.txt` (JSON format).
2. Every display polls `GET /get_notice` every 5 seconds with a cache-busting URL.
3. If the image name **or** the timestamp changed, the display reloads the poster instantly.
4. Removing the image restores the text notice automatically.

### Notice data format (`server/notice.txt`)
```json
{"notice": "Sports Day on Friday!", "updated_at": "05-09-2026 10:26 PM IST", "image": "notice_image.jpg"}
```
Old plain-text notice files are still read via an automatic fallback.

### Environment variables (`.env`)
| Variable | Purpose | Default |
|---|---|---|
| `SECRET_KEY` | Signs admin sessions | *required* |
| `ADMIN_PASSWORD` | Admin login password | *required* |
| `SESSION_COOKIE_SECURE` | Force secure cookies | `false` |
| `ADMIN_SESSION_HOURS` | Admin session lifetime | `8` |

---

## 🏗️ System Architecture

```
Administrator (phone / laptop)
        │  HTTPS
        ▼
Cloud Server (PythonAnywhere) — Waitress + Flask
 ├── /admin/login    secure authentication
 ├── /admin          send notices + upload posters
 ├── /admin/logout   end session
 ├── /display        TV view (any browser, F11 fullscreen)
 ├── /get_notice     JSON: notice + IST timestamp + image name
 ├── /upload_image   save poster to server/uploads/
 └── /uploads/...    serve posters
        │  HTTPS — polls every 5 seconds
        ▼
Receiver Device(s) (TV box / laptop)
 └── Browser → /display
        │ HDMI
        ▼
Television
```

The same code also runs locally (`python server/server.py`) for LAN testing —
successfully demonstrated on a real non-smart TV via HDMI.

---

## 🐛 Challenges Faced & How They Were Solved

A debugging journal from real deployments and live demonstrations.

### 🚨 Production Incidents
- **Wrong time on TVs during a live demo** — the cloud server runs in UTC while the school follows Indian Standard Time. *Fix:* server-side IST timestamps (`UTC+5:30`) attached to every notice, so displays never trust the TV's own clock.
- **TVs kept showing old notices** — kiosk browsers aggressively cached the polling response. *Fix:* cache-busting URLs (`?t=…`) plus server `Cache-Control: no-store` headers.
- **A new poster wouldn't replace the old one** — images are stored under a fixed filename, so the display saw "same name = same image". *Fix:* the server stamps a fresh timestamp on every upload and the display refreshes whenever the name *or* the timestamp changes.

### 🎨 Frontend & Layout Battles
- **Line breaks typed in the admin editor vanished on the TV** — HTML collapses newlines by default. *Fix:* `white-space: pre-wrap`.
- **Decorative divider lines disappeared with tall multi-line notices** — the flexbox layout squished the thin divider elements to zero height to make room. *Fix:* `flex-shrink: 0` on logo/dividers/footer; only the notice text may shrink.
- **Uploaded posters covered the whole screen** — a fixed fullscreen overlay hid the school branding. *Fix:* in-flow image inside the board frame with `object-fit: contain`.
- **Fixed text sizes wasted screen space** — big/medium/small tiers ignored line count. *Fix:* line-aware auto-sizing with alignment (full auto-fit remains on the roadmap).

### 🛠️ Developer Tooling Traps
- **Copy-paste silently corrupted code** — chat markdown stripped `__name__`/`__file__` underscores and turned `<path:filename>` into a link; broken code was committed and merged. *Fix:* verified with `Select-String`, repaired with a Python script that writes exact bytes to disk, and adopted a "run locally before committing" rule.
- **PowerShell created a UTF-16 `.env` file** — `echo >` wrote a UTF-16 BOM that crashed python-dotenv with `UnicodeDecodeError`. *Fix:* recreate config files in a proper editor (UTF-8).
- **"Fixed" code appeared not to work** — the running server and open tabs kept old code in memory. *Fix:* kill all server processes, start a single server, and test in a fresh private browser window.
- **Admin buttons did nothing** — an inline script re-declared a `const` already declared in `admin.js`, killing the script with a silent SyntaxError. *Fix:* wrap inline scripts in their own function scope (IIFE).
- **A rebuilt HTML file lost all styling** — rewriting `display.html` without knowing the CSS structure broke the layout. *Fix:* restored from a `.bak` backup. *Lesson:* always back up before overwriting.

### 🔀 Git & Deployment Recovery
- **`git pull` blocked on the live server** — local test data in `notice.txt` would be overwritten. *Fix:* `git restore` the file, then pull.
- **Broken code merged into `main`** — committed before verifying files were saved. *Fix:* `fetch` → `reset --hard origin/main` → repair → `commit --amend` → `push --force` → hotfix PR.
- **PythonAnywhere console limits** — the free tier caps bash consoles. *Fix:* reuse an existing console; deployment only needs one.

### 🔐 Reliability & Security
- **Desktop app couldn't scale** — migrated the Tkinter MVP to a fully web-based architecture with a Waitress production server for concurrent TV polling.
- **Login crashed on non-ASCII passwords** — *Fix:* UTF-8 encoding on both sides of `hmac.compare_digest`.
- **Network drops crashed TVs to a browser error** — *Fix:* localStorage offline cache with 🟢/🔴 status and automatic reconnection.

---

## 🎯 Next Goals
- ⏳ Scheduled notices (auto-publish at a set time).
- ⏳ Multiple posters with automatic rotation.

---

*Built by Class 11, Nath Valley School — with security contributions by Raghav.*
