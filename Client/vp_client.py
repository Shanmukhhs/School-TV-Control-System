import requests

notice=input("Enter a new notice:")

response=requests.post(
    "http://127.0.0.1:5000/update_notice",
    data=notice
)
print(response.text)