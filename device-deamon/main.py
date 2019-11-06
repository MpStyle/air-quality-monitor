from time import sleep
import requests
from datetime import date
import json
from book.BME280DataReader import BME280DataReader
from book.CCS811DataReader import CCS811DataReader
from book.DHT11DataReader import DHT11DataReader
from book.DataCollector import DataCollector
from book.GetIpAddress import getIpAddress
from book.SystemArgumentsReader import systemArgumentsReader
from book.SystemArgumentsReader import printHelp
from book.DataUpload import dataUpload
import time
import sys
import threading

clock = 0
options = systemArgumentsReader(sys.argv)

if options.help:
    printHelp()
    exit(0)

# Initialization
bme280DataReader = BME280DataReader()
ccs811DataReader = CCS811DataReader()
dht11DataReader = DHT11DataReader()
dataCollector = DataCollector()

while(1):
    clock += 1

    # Collects data
    dataCollector.addData(
        bme280DataReader.getData(),
        ccs811DataReader.getData(),
        dht11DataReader.getData()
    )

    # Composes data to send to the cloud
    data = json.dumps({
        "secretKey": options.secretKey,
        "device": {
            "id": options.deviceId,
            "name": options.deviceName,
            "ip": getIpAddress(),
        },
        "airData": dataCollector.getData().__dict__,
        "measurementDate": int((time.time() * 1000)),
    })

    if options.verbose:
        print(data)

    if options.uploadData:
        # After 60 readings the data will be send to the cloud
        if clock % 60 == 0:
            # send data
            threading.Thread(target=dataUpload, args=(
                data, options.airCareUrl,)).start()

            clock = 0

    sleep(1)
