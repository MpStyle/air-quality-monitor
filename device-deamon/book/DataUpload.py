import requests
import time


def dataUpload(data, airCareUrl: str, uploadTimeout: int, uploadRetry: int):

    while True:
        response = requests.put(airCareUrl, data=data, timeout=uploadTimeout)

        print("Data upload status_code: " + response.status_code)
        print("Data upload json: " + response.json())

        if (response.status_code == 200 and response.json().payload == True) or uploadRetry == -1:
            break

        time.sleep(uploadRetry)
