import json
from entity.Configuration import Configuration


def readConfiguration() -> Configuration:
    with open('/opt/aircare.configuration.json', 'r') as jsonFile:
        data = json.load(jsonFile)

        configuration = Configuration()
        configuration.deviceId = data['deviceId']
        configuration.deviceName = data['deviceName']

        if "deviceAddress" in data:
            configuration.deviceAddress = data['deviceAddress']
        else:
            configuration.deviceAddress = ""

        configuration.secretKey = data['secretKey']
        configuration.airCareUrl = data['airCareUrl']

        return configuration
