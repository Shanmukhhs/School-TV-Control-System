from flask import Flask
from pathlib import Path

app=Flask(__name__)

@app.route("/")
def home():
    return "School TV control Server Running"

notice_folder=Path(__file__).resolve().parent
notice=notice_folder/"notice.txt"

@app.route("/get_notice")
def get_notice():
    return notice.read_text()

app.run(host="0.0.0.0",port=5000)