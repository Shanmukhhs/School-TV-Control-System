import tkinter
import requests
from datetime import datetime
from pathlib import Path
from PIL import Image, ImageTk

# -----------------------------
# Window
# -----------------------------
window = tkinter.Tk()
project_folder = Path(__file__).resolve().parent.parent
logo_path = project_folder / "Assets" / "nath valley logo.png"
window.title("Nath Valley School TV Display")
window.attributes("-fullscreen", True)
window.configure(bg="white")

# Press ESC to exit while developing
window.bind("<Escape>", lambda event: window.destroy())

# -----------------------------
# Variables
# -----------------------------
previous_notice = ""

# -----------------------------
# Header
# -----------------------------
header = tkinter.Frame(window, bg="white")
header.pack(fill="x", pady=(25, 10))

# Placeholder for school logo
logo_image = Image.open(logo_path)
logo_image.thumbnail((180, 180))

logo_photo = ImageTk.PhotoImage(logo_image)

logo = tkinter.Label(
    header,
    image=logo_photo,
    bg="white"
)

logo.pack()

divider1 = tkinter.Frame(window, bg="#003366", height=2)
divider1.pack(fill="x", padx=80, pady=(5, 15))

title = tkinter.Label(
    window,
    text="NOTICE",
    font=("Arial", 30, "bold"),
    bg="white",
    fg="#003366"
)
title.pack()

divider2 = tkinter.Frame(window, bg="#003366", height=2)
divider2.pack(fill="x", padx=80, pady=15)

# -----------------------------
# Notice Area
# -----------------------------
notice_label = tkinter.Label(
    window,
    text="No Notice Available",
    font=("Arial", 42, "bold"),
    bg="white",
    fg="black",
    wraplength=1200,
    justify="center"
)
notice_label.pack(expand=True)

divider3 = tkinter.Frame(window, bg="#003366", height=2)
divider3.pack(fill="x", padx=80, pady=15)

# -----------------------------
# Footer
# -----------------------------
last_updated = tkinter.Label(
    window,
    text="Last Updated: Never",
    font=("Arial", 16),
    bg="white",
    fg="gray"
)
last_updated.pack(pady=(0, 25))

# -----------------------------
# Server Update Function
# -----------------------------
def check_for_updates():
    global previous_notice

    try:
        response = requests.get("http://127.0.0.1:5000/get_notice")
        current_notice = response.text.strip()

        if current_notice != previous_notice:

            if current_notice == "":
                notice_label.config(
                    text="No Notice Available",
                    font=("Arial", 42, "bold")
                )

            else:
                # Dynamic font sizing
                if len(current_notice) < 40:
                    size = 52
                elif len(current_notice) < 120:
                    size = 38
                else:
                    size = 28

                notice_label.config(
                    text=current_notice,
                    font=("Arial", size, "bold")
                )

            current_time = datetime.now().strftime("%I:%M %p")
            last_updated.config(text=f"Last Updated: {current_time}")

            previous_notice = current_notice

    except Exception as e:
        notice_label.config(
    text="Connecting to Server...",
    font=("Arial", 32, "bold")
)

    window.after(5000, check_for_updates)

# -----------------------------
# Start
# -----------------------------
check_for_updates()

window.mainloop()