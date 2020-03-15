#include "Adafruit_BMP280.h"

#ifndef BMP280SENSOR_H
#define BMP280SENSOR_H

struct BMP280Data
{
    float temperature;
    float pressure;
    float altitude;
};

class BMP280Sensor
{
private:
    Adafruit_BMP280 bmp;

public:
    bool setup();
    BMP280Data getData();
};

#endif
