import tkinter,requests
from datetime import datetime

window = tkinter.Tk()

window.title("Nath Valley School - TV Notice Management")
window.geometry("700x500")

def send_notice():

    notice = notice_box.get("1.0", tkinter.END).strip()

    if notice == "":
        status_label.config(text="Status: Notice cannot be empty.")
        return

    try:
        response = requests.post(
            "http://192.168.1.4:5000/update_notice",
            data={"notice": notice}
        )

        if response.text == "Success":

            status_label.config(text="Status: Notice sent successfully!")

            current_time = datetime.now().strftime("%I:%M %p")
            last_sent_label.config(text=f"Last Sent: {current_time}")

            notice_box.delete("1.0", tkinter.END)

        else:
            status_label.config(text="Status: Server returned an error.")

    except Exception as e:
        status_label.config(text=f"Status: {e}")

# ===== Title =====
title = tkinter.Label(
    window,
    text="NATH VALLEY SCHOOL\nTV Notice Management",
    font=("Arial", 16, "bold")
)
title.pack(pady=10)

# ===== Notice Label =====
notice_label = tkinter.Label(window, text="Notice:")
notice_label.pack(anchor="w", padx=20)

# ===== Notice Text Box =====
notice_box = tkinter.Text(
    window,
    height=12,
    width=70
)
notice_box.pack(padx=20, pady=5)

send_button = tkinter.Button(
    window,
    text="SEND NOTICE",
    font=("Arial", 12, "bold"),
    bg="#228B22",
    fg="white",
    command=send_notice
)

send_button.pack(pady=10)

status_label = tkinter.Label(
    window,
    text="Status: Ready"
)

status_label.pack()

last_sent_label = tkinter.Label(
    window,
    text="Last Sent: Never"
)

last_sent_label.pack()


window.mainloop()
