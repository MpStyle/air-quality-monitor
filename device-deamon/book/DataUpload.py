import requests
import time
import json


def dataUpload(data, airCareUrl: str, uploadTimeout: int, uploadRetry: int):

    while True:
        response = requests.put(airCareUrl, json=data, timeout=uploadTimeout)

        print("Data upload status_code: " + str(response.status_code))
        print("Data upload json: " + json.dumps(response.json()))

        if response.status_code == 200 or uploadRetry == -1:
            print("Data uploaded with success")
            print("")
            break

        time.sleep(uploadRetry)
