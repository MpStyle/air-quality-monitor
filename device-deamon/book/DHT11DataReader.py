import sys
import Adafruit_DHT
from entity.DHT11Data import DHT11Data


class DHT11DataReader:
    def getData(self) -> DHT11Data:
        humidity, temperature = Adafruit_DHT.read(11, 4)

        data = DHT11Data()
        data.humidity = humidity
        data.temperature = temperature

        return data
