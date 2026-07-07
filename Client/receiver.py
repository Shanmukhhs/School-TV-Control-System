import requests,time

previous_notice=""
while True:
    response=requests.get("http://127.0.0.1:5000/get_notice")
    current_notice=response.text
    if previous_notice!=current_notice:
        print(current_notice)
        previous_notice=current_notice
    time.sleep(5)