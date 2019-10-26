from time import sleep
import requests
from datetime import date
import json
from book.BME280DataReader import BME280DataReader
from book.CCS811DataReader import CCS811DataReader
from book.DHT11DataReader import DHT11DataReader
from book.DataCollector import DataCollector
from book.ConfigurationReader import ConfigurationReader

clock = 0

# Initialization
bme280DataReader = BME280DataReader()
ccs811DataReader = CCS811DataReader()
dht11DataReader = DHT11DataReader()
dataCollector = DataCollector()
configurationReader = ConfigurationReader()

while ccs811DataReader.areDataAvailable():
    pass

# Calibrations
bme280DataReader.calibration()

# Reads configuration
configuration = configurationReader.read()

while(1):
    clock += 1

    # Retrieves data
    bme280Data = bme280DataReader.getData()
    ccs811Data = ccs811DataReader.getData()
    dht11Data = dht11DataReader.getData()

    # Collects data
    dataCollector.addData(bme280Data, ccs811Data, dht11Data)

    # After 60 readings the data will be send to the cloud
    if clock % 60 == 0:
        # Composes data to send to the cloud
        data = json.dumps({
            "secretKey": configuration["secretKey"],
            "device": {
                "id": configuration["deviceId"],
                "name": configuration["deviceName"],
            },
            "airData": dataCollector.getData().__dict__
        })

        # send data
        response = requests.put(
            configuration['airCareUrl'], data=json.dumps(data))

        print(response)
        clock = 0

    sleep(1)
