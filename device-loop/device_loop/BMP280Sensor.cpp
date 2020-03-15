#include "BMP280Sensor.h"

bool BMP280Sensor::setup()
{
    if (!bmp.begin(0x76))
    {
        Serial.println(F("Could not find a valid BMP280 sensor, check wiring!"));
        return false;
    }

    /* Default settings from datasheet. */
    bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,     /* Operating Mode. */
                    Adafruit_BMP280::SAMPLING_X2,     /* Temp. oversampling */
                    Adafruit_BMP280::SAMPLING_X16,    /* Pressure oversampling */
                    Adafruit_BMP280::FILTER_X16,      /* Filtering. */
                    Adafruit_BMP280::STANDBY_MS_500); /* Standby time. */

    return true;
}

BMP280Data BMP280Sensor::getData()
{
    BMP280Data bmp280Data;

    bmp280Data.temperature = bmp.readTemperature();
    bmp280Data.pressure = bmp.readPressure() / 100;
    bmp280Data.altitude = bmp.readAltitude(1013.25);

    return bmp280Data;
}
