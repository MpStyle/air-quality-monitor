#include "AirQualityMonitor.h"

void AirQualityMonitor::begin()
{
    this->timeClient.begin();
}

void AirQualityMonitor::addData(BMP280Data bmp, CCS811Data ccs, DHT11Data dht)
{
    if (!isnan(bmp.temperature))
    {
        this->temperatures[this->temperatureCurrentPosition++] = bmp.temperature;

        if (this->temperatureCurrentPosition >= AirQualityMonitor::BUFFER_SIZE)
        {
            this->temperatureCurrentPosition = 0;
        }
    }

    if (!isnan(bmp.pressure))
    {
        this->pressures[this->pressureCurrentPosition++] = bmp.pressure;

        if (this->pressureCurrentPosition >= AirQualityMonitor::BUFFER_SIZE)
        {
            this->pressureCurrentPosition = 0;
        }
    }

    if (!isnan(dht.temperature))
    {
        this->temperatures[this->temperatureCurrentPosition++] = dht.temperature;

        if (this->temperatureCurrentPosition >= AirQualityMonitor::BUFFER_SIZE)
        {
            this->temperatureCurrentPosition = 0;
        }
    }

    if (!isnan(dht.humidity))
    {
        this->humidities[this->humidityCurrentPosition++] = dht.humidity;

        if (this->humidityCurrentPosition >= AirQualityMonitor::BUFFER_SIZE)
        {
            this->humidityCurrentPosition = 0;
        }
    }

    if (!isnan(ccs.temperature))
    {
        this->temperatures[this->temperatureCurrentPosition++] = ccs.temperature;

        if (this->temperatureCurrentPosition >= AirQualityMonitor::BUFFER_SIZE)
        {
            this->temperatureCurrentPosition = 0;
        }
    }

    if (!isnan(ccs.co2))
    {
        this->co2s[this->co2CurrentPosition++] = ccs.co2;

        if (this->co2CurrentPosition >= AirQualityMonitor::BUFFER_SIZE)
        {
            this->co2CurrentPosition = 0;
        }
    }

    if (!isnan(ccs.tvoc))
    {
        this->tvocs[this->tvocCurrentPosition++] = ccs.tvoc;

        if (this->tvocCurrentPosition >= AirQualityMonitor::BUFFER_SIZE)
        {
            this->tvocCurrentPosition = 0;
        }
    }
}

bool AirQualityMonitor::upload(Configuration configuration)
{
    int temperatureCount = 0;
    float temperature = 0;
    for (int i = 0; i < AirQualityMonitor::BUFFER_SIZE && !isnan(this->temperatures[i]); i++)
    {
        temperatureCount++;
        temperature += this->temperatures[i];
    }

    int co2Count = 0;
    float co2 = 0;
    for (int i = 0; i < AirQualityMonitor::BUFFER_SIZE && !isnan(this->co2s[i]); i++)
    {
        co2Count++;
        co2 += this->co2s[i];
    }

    int tvocCount = 0;
    float tvoc = 0;
    for (int i = 0; i < AirQualityMonitor::BUFFER_SIZE && !isnan(this->tvocs[i]); i++)
    {
        tvocCount++;
        tvoc += this->tvocs[i];
    }

    int humidityCount = 0;
    float humidity = 0;
    for (int i = 0; i < AirQualityMonitor::BUFFER_SIZE && !isnan(this->humidities[i]); i++)
    {
        humidityCount++;
        humidity += this->humidities[i];
    }

    int pressureCount = 0;
    float pressure = 0;
    for (int i = 0; i < AirQualityMonitor::BUFFER_SIZE && !isnan(this->pressures[i]); i++)
    {
        pressureCount++;
        pressure += this->pressures[i];
    }

    timeClient.update();

    char json[300];
    sprintf(
        json,
        "{ \"secretKey\": \"%s\", \"readingDate\": %d000, \"device\": { \"cpuTemperature\": 0, \"id\": \"%s\", \"name\": \"%s\", \"address\": \"%s\", \"ip\": \"%s\" }, \"airData\": { \"temperature\":%s, \"co2\":%s, \"tvoc\":%s, \"humidity\":%s, \"pressure\":%s } }",
        configuration.secretKey,
        timeClient.getEpochTime(),
        configuration.deviceId, configuration.deviceName, configuration.deviceAddress, configuration.ip,
        isnan(temperature) || temperatureCount == 0 ? "null" : String(temperature / temperatureCount),
        isnan(co2) || co2Count == 0 ? "null" : String(co2 / co2Count),
        isnan(tvoc) || tvocCount == 0 ? "null" : String(tvoc / tvocCount),
        isnan(humidity) || humidityCount == 0 ? "null" : String(humidity / humidityCount),
        isnan(pressure) || pressureCount == 0 ? "null" : String(pressure / pressureCount));

    Serial.print("Sending to ");
    Serial.print(configuration.backendServiceUrl);
    Serial.print(" json: ");
    Serial.println(json);

     http.begin(configuration.backendServiceUrl);
     http.addHeader("Content-Type", "application/json");
     int httpResponseCode = http.PUT(json);
     if (httpResponseCode > 0)
     {
         Serial.println("Success on sending PUT");
         Serial.println(http.getString());
         return true;
     }

     Serial.print("Error on sending POST: ");
     Serial.println(httpResponseCode);
    return false;
}
