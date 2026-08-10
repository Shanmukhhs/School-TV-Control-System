## Next Goals

* ⏳ Test the software on a real rasp node in school.

## Version History & Changelog

**Version 3.1 — Advanced Security & Session Management**
* Replaced hardcoded secrets with local `.env` environment variables.
* Implemented constant-time password comparison using `hmac.compare_digest` to prevent timing attacks.
* Added automatic session expiration and secure cookie flags (`HTTPONLY`, `SAMESITE`).
* Updated `.gitignore` to prevent accidental commits of local secret files.

**Version 3 — Production Ready & Offline Resilience**
* Switched from Flask dev server to Waitress WSGI server.
* Added client-side `localStorage` caching for offline network failure resilience.
* Implemented basic admin authentication.

**Version 2 — Fully Web-Based**
* Migrated from desktop GUI to a web-based architecture.

## Authors & Contributors

* **[Shanmukh Sitturi]** — *Architecture, Offline Caching, Hardware/Software Integration*
* **[Raghav Raut]** — *Security, Session Management, Environment Variables*

Class 11, Nath Valley School