#include "DHT11Sensor.h"

bool DHT11Sensor::setup()
{
    this->dht.begin();
    return true;
}

DHT11Data DHT11Sensor::getData()
{
    DHT11Data data;

    data.humidity = this->dht.readHumidity();
    data.temperature = this->dht.readTemperature();

    return data;
}