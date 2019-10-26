from entity.BME280Data import BME280Data
from entity.CCS811Data import CCS811Data
from entity.DHT11Data import DHT11Data
from entity.AirData import AirData


class DataCollector:
    # Buffers size
    TEMPERATURE_BUFFER_SIZE = 16
    TVOC_BUFFER_SIZE = 16
    CO2_BUFFER_SIZE = 16
    HUMIDITY_BUFFER_SIZE = 16
    PRESSURE_BUFFER_SIZE = 16

    # Buffers
    temperatures = []
    tvocs = []  # Volatile Organic Compounds
    co2s = []
    pressures = []
    humidities = []

    def addData(self, bme280Data: BME280Data, ccs811Data: CCS811Data, dht11Data: DHT11Data):
        # DHT11
        if dht11Data.temperature is not None and dht11Data.humidity is not None:
            if len(self.temperatures) == self.TEMPERATURE_BUFFER_SIZE:
                self.temperatures.remove(self.temperatures[0])
            self.temperatures.append(dht11Data.temperature)

            if len(self.humidities) == self.HUMIDITY_BUFFER_SIZE:
                self.humidities.remove(self.humidities[0])
            self.humidities.append(dht11Data.humidity)

        # BME280
        if len(self.temperatures) == self.TEMPERATURE_BUFFER_SIZE:
            self.temperatures.remove(self.temperatures[0])
        self.temperatures.append(bme280Data.temperature)

        if len(self.pressures) == self.PRESSURE_BUFFER_SIZE:
            self.pressures.remove(self.pressures[0])
        self.pressures.append(bme280Data.pressure)

        # CCS811
        if ccs811Data.temperature != None:
            if len(self.temperatures) == self.TEMPERATURE_BUFFER_SIZE:
                self.temperatures.remove(self.temperatures[0])
            self.temperatures.append(ccs811Data.temperature)

        if ccs811Data.tvoc != None:
            if len(self.tvocs) == self.TVOC_BUFFER_SIZE:
                self.tvocs.remove(self.tvocs[0])
            self.tvocs.append(ccs811Data.tvoc)

        if ccs811Data.co2 != None:
            if len(self.co2s) == self.CO2_BUFFER_SIZE:
                self.co2s.remove(self.co2s[0])
            self.co2s.append(ccs811Data.co2)

    def getData(self) -> AirData:
        data = AirData()

        data.temperature = round(
            sum(self.temperatures) / len(self.temperatures), 2)

        if len(self.tvocs) > 0:
            data.tvoc = round(sum(self.tvocs) / len(self.tvocs), 2)
        else:
            data.tvoc = None

        if len(self.co2s) > 0:
            data.co2 = round(sum(self.co2s) / len(self.co2s), 2)
        else:
            data.co2s = None

        data.pressure = round(sum(self.pressures) / len(self.pressures), 2)

        if len(self.humidities) > 0:
            data.humidity = round(sum(self.humidities) /
                                  len(self.humidities), 2)
        else:
            data.humidity = None

        return data
