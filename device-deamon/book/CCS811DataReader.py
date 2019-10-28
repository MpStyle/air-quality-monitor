from entity.CCS811Data import CCS811Data
import time
import board
import busio
import adafruit_ccs811
from time import sleep


class CCS811DataReader:
    TEMPERATURE_DELTA = 5
    TVOC_DELTA = 8
    CO2_DELTA = 50

    ccs5A: adafruit_ccs811.CCS811
    ccs5B: adafruit_ccs811.CCS811

    def __init__(self):
        i2c = busio.I2C(board.SCL, board.SDA)
        self.ccs5A = adafruit_ccs811.CCS811(i2c, 0x5a)
        self.ccs5B = adafruit_ccs811.CCS811(i2c, 0x5b)

    def getData(self) -> CCS811Data:
        data = CCS811Data()
        data.temperature = None
        data.tvoc = None
        data.co2 = None

        if not self.ccs5A.data_ready:
            return data

        temp5A = self.ccs5A.temperature
        tvoc5A = self.ccs5A.tvoc
        co25A = self.ccs5A.eco2

        sleep(0.5)

        if not self.ccs5B.data_ready:
            return data

        temp5B = self.ccs5B.temperature
        tvoc5B = self.ccs5B.tvoc
        co25B = self.ccs5B.eco2

        if abs(temp5A-temp5B) <= self.TEMPERATURE_DELTA:
            data.temperature = (temp5A+temp5B)/2
        else:
            data.temperature = None

        if abs(tvoc5A-tvoc5B) <= self.TVOC_DELTA:
            data.tvoc = (tvoc5A+tvoc5B)/2
        else:
            data.tvoc = None

        if abs(co25A-co25B) <= self.CO2_DELTA:
            data.co2 = (co25A+co25B)/2
        else:
            data.co2 = None

        return data
