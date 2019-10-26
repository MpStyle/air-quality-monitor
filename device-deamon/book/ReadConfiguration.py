import json
from entity.Configuration import Configuration


def readConfiguration() -> Configuration:
    with open('/opt/configuration.json', 'r') as jsonFile:
        data = json.load(jsonFile)

        configuration = Configuration()
        configuration.deviceName = data['deviceName']
        configuration.backendBaseUrl = data['backendBaseUrl']

        return configuration
