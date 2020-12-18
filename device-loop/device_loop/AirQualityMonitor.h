#include "BMP280Sensor.h"
#include "CCS811Sensor.h"
#include "DHT11Sensor.h"
#include "HTTPClient.h"
#include <NTPClient.h>
#include <WiFiUdp.h>
#include "WiFiData.h"

#ifndef AIRQUALITYMONITOR_H
#define AIRQUALITYMONITOR_H

struct Configuration
{
    char *secretKey;
    char *deviceId;
    char *deviceName;
    char *deviceAddress;
    char *backendServiceUrl;
    const char *ip;
};

class AirQualityMonitor
{
private:
    HTTPClient http;

    WiFiUDP ntpUDP;
    NTPClient timeClient = NTPClient(ntpUDP);

    static const int BUFFER_SIZE = 16;

    int temperatureCurrentPosition = 0;
    int co2CurrentPosition = 0;
    int tvocCurrentPosition = 0;
    int humidityCurrentPosition = 0;
    int pressureCurrentPosition = 0;

    float temperatures[AirQualityMonitor::BUFFER_SIZE] = {NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN};
    float co2s[AirQualityMonitor::BUFFER_SIZE] = {NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN};
    float tvocs[AirQualityMonitor::BUFFER_SIZE] = {NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN};
    float humidities[AirQualityMonitor::BUFFER_SIZE] = {NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN};
    float pressures[AirQualityMonitor::BUFFER_SIZE] = {NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN, NAN};

    WiFiData wiFiData;

public:
    void begin();
    void addData(BMP280Data bmp, CCS811Data ccs, DHT11Data dht, WiFiData wf);
    bool upload(Configuration configuration);
};

#endif
