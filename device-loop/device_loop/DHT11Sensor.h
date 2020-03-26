#include "DHT.h"

#ifndef DHT11SENSOR_H
#define DHT11SENSOR_H

struct DHT11Data
{
    float temperature;
    float humidity;
};

class DHT11Sensor
{
private:
    DHT dht=DHT(4, DHT11);

public:
    bool setup();
    DHT11Data getData();
};

#endif