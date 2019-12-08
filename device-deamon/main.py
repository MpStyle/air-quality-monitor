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
from book.ReadConfiguration import readConfiguration
from book.DataUpload import dataUpload
import time
import sys
import threading

print("Air Quality Monitor - Device Deamon")

clock = 0
options = systemArgumentsReader(sys.argv)

if options.help:
    printHelp()
    exit(0)

configuration = readConfiguration()

print("Upload data: " + ("true" if options.uploadData else "no"))
print("Readings buffer: " + str(options.readingsBuffer))

# Initialization
bme280DataReader = BME280DataReader()
ccs811DataReader = CCS811DataReader()
dht11DataReader = DHT11DataReader()
dataCollector = DataCollector()

while(1):
    clock += 1

    # Collects data
    if options.verbose:
        print("Collecting data...")

    bme280Data = bme280DataReader.getData(),
    ccs811Data = ccs811DataReader.getData(),
    dht11Data = dht11DataReader.getData()

    dataCollector.addData(
        bme280DataReader.getData(),
        ccs811DataReader.getData(),
        dht11DataReader.getData()
    )

    if options.uploadData:
        # After "options.readingsBuffer" readings the data will be send to the cloud
        if clock % options.readingsBuffer == 0:
            # Composes data to send to the cloud
            data = {
                "secretKey": configuration.secretKey,
                "device": {
                    "id": configuration.deviceId,
                    "name": configuration.deviceName,
                    "address": configuration.deviceAddress,
                    "ip": getIpAddress(),
                },
                "airData": dataCollector.getData().__dict__,
                "measurementDate": int((time.time() * 1000)),
            }

            if options.verbose:
                print("Data to send: " + json.dumps(data))

            # send data
            threading.Thread(target=dataUpload, args=(
                data, configuration.airCareUrl, options.uploadTimeout, options.uploadRetry,)).start()

            clock = 0

    sleep(1)
