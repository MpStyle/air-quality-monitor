import requests


def dataUpload(data, airCareUrl: str):
    response = requests.put(airCareUrl, data=data, timeout=30)

    print("Data upload result: " + response)
