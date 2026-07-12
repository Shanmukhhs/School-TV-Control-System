from flask import Flask,request
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

@app.route("/update_notice",methods=["POST"])
def update_notice():
    notice.write_text(request.form["notice"])
    return "Success"

app.run(host="0.0.0.0",port=5000)

    