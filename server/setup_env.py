"""Helper used by start_server.bat to save the admin password into .env.

Reads the new password from the NEW_ADMIN_PASSWORD environment variable,
validates it, preserves any existing .env settings (like SECRET_KEY),
and rewrites the file.
"""
import os
import pathlib
import secrets

# Same placeholders the server refuses to start with.
DISALLOWED = {"change-me", "replace-me", "admin123"}
MIN_LENGTH = 8

ENV_PATH = pathlib.Path(__file__).resolve().parent.parent / ".env"


def load_existing():
    """Parse KEY=VALUE pairs out of the current .env, ignoring comments."""
    values = {}
    if ENV_PATH.exists():
        for line in ENV_PATH.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, val = line.split("=", 1)
            values[key.strip()] = val.strip()
    return values


def main():
    password = os.environ.get("NEW_ADMIN_PASSWORD", "")

    if len(password) < MIN_LENGTH:
        print(f"ERROR: Password must be at least {MIN_LENGTH} characters long.")
        return 1
    if password.lower() in DISALLOWED:
        print("ERROR: That password is not allowed. Pick something private.")
        return 1

    values = load_existing()

    if not values.get("SECRET_KEY"):
        values["SECRET_KEY"] = secrets.token_hex(32)
        print("Generated a new random SECRET_KEY.")

    values["ADMIN_PASSWORD"] = password
    values.setdefault("SESSION_COOKIE_SECURE", "false")
    values.setdefault("ADMIN_SESSION_HOURS", "8")

    ENV_PATH.write_text(
        "\n".join(f"{key}={value}" for key, value in values.items()) + "\n",
        encoding="utf-8",
    )
    print(f"Saved admin password to {ENV_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
