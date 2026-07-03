from pathlib import Path

#Path to the folder where server.py is located
SERVER_FOLDER=Path(__file__).parent

#Path to notice.txt
NOTICE_FILE=SERVER_FOLDER/"notice.txt"

#Create the file if it doesn't exist
if not NOTICE_FILE.exists():
    NOTICE_FILE.write_text("Welcome to Nath Valley School!")

#Read the current notice
current_notice=NOTICE_FILE.read_text()

print("==== SERVER STARTED ====")
print("Current Notice:")
print(current_notice)
print()

new_notice=input("Enter a new notice (or press Enter to keep current):")

if new_notice:
    NOTICE_FILE.write_text(new_notice)
    print("Notice updated successfully")
else:
    print("Notice unchanged.")