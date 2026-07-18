from pathlib import Path
import sys
from datetime import datetime
import requests
import json

config_path = Path(__file__).resolve().parent / "receiver_config.json"

with open(config_path, "r") as file:
    config = json.load(file)

SERVER_IP = config["server_ip"]
PORT = config["port"]

print("=" * 40)
print("Starting Nath Valley TV Display...")
print("=" * 40)

current_time = datetime.now().strftime("%d-%m-%Y %I:%M:%S %p")

print(f"Startup Time : {current_time}")

project_folder = Path(__file__).resolve().parent.parent
logo_path = project_folder / "Assets" / "nath valley logo.png"

if not logo_path.exists():
    print("ERROR: School logo not found!")
    print(f"Expected location: {logo_path}")
    sys.exit()

print("✓ Assets verified.")
print("Launching TV Display...")

print("Checking server...")

try:
    response = requests.get(f"http://{SERVER_IP}:{PORT}", timeout=3)

    if response.status_code == 200:
        print("✓ Server is online.")

except Exception:
    print("⚠ Server is offline.")
    print("TV will continue in Offline Mode.")

import tv_display