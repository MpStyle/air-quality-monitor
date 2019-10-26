import bme280
import smbus2
from entity.BME280Data import BME280Data


class BME280DataReader:
    bus: smbus2.SMBus

    def __init__(self):
        self.bus = smbus2.SMBus(0x01)

    def calibration(self):
        bme280.load_calibration_params(self.bus, 0x76)

    def getData(self) -> BME280Data:
        bme280_data = bme280.sample(self.bus, 0x76)

        data = BME280Data()
        data.pressure = bme280_data.pressure
        data.temperature = bme280_data.temperature

        return data
