import json


class ConfigurationReader:
    def read(self) -> dict:
        with open('/opt/aircare.configuration.json') as file:
            return json.loads(file.read())
