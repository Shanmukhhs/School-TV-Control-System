import requests,time,os

previous_notice=""
while True:
    try:
        response=requests.get("http://127.0.0.1:5000/get_notice")
        current_notice=response.text
        if previous_notice!=current_notice:
            os.system("cls")
            print("==================================")
            print(f'{"NATH VALLEY SCHOOL":^34}')
            print("==================================\n")

            print(current_notice)
            previous_notice=current_notice
    except Exception as e :
        print(f"An error occured:{e}")

    
    time.sleep(5)