#include "Adafruit_CCS811.h"

#ifndef CCS811SENSOR_H
#define CCS811SENSOR_H

struct CCS811Data
{
    float temperature = NAN;
    float co2 = NAN;
    float tvoc = NAN;
};

class CCS811Sensor
{
private:
    const int READINGS_BEFORE_RESET_COUNT = 150;
    const int RESET_PIN_5A = 15;
    const int RESET_PIN_5B = 14;
    const int DELTA_TEMPERATURE = 2;
    const int DELTA_CO2 = 40;
    const float DELTA_TVOC = 0.4;

    int readingCount = 0;

    Adafruit_CCS811 ccs_5a;
    Adafruit_CCS811 ccs_5b;

    bool reset();

public:
    bool setup();
    CCS811Data getData();
};

#endif
