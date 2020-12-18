#include "CCS811Sensor.h"
#include "BMP280Sensor.h"
#include "DHT11Sensor.h"
#include "AirQualityMonitor.h"
#include "Configuration.h"

CCS811Sensor ccs811;
BMP280Sensor bmp280;
DHT11Sensor dht11;
AirQualityMonitor airQualityMonitor;
Configuration configuration;
int loopCount = 0;
const int MAX_LOOP_COUNT = 60;

void setup()
{
    Serial.begin(9600);

    // WIFI settings/connection: delay needed before calling the WiFi.begin
    delay(4000);

    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(1000);
        Serial.println("Connecting to WiFi..");
    }

    if (!ccs811.setup() || !bmp280.setup() || !dht11.setup())
    {
        while (1)
            ;
    }

    Serial.println(WiFi.localIP().toString().c_str());

    configuration.deviceAddress = DEVICE_ADDRESS;
    configuration.deviceId = DEVICE_ID;
    configuration.deviceName = DEVICE_NAME;
    configuration.ip = "";
    configuration.secretKey = SECRET_KEY;
    configuration.backendServiceUrl = BACKEND_SERVICE_URL;
}

void loop()
{
    CCS811Data ccsData = ccs811.getData();
    BMP280Data bmpData = bmp280.getData();
    DHT11Data dhtData = dht11.getData();
    WiFiData wifiData;

    wifiData.ip = WiFi.localIP();
    wifiData.ssid = WIFI_SSID;
    wifiData.strenght = WiFi.RSSI();

    airQualityMonitor.addData(bmpData, ccsData, dhtData, wifiData);

    if (loopCount >= MAX_LOOP_COUNT)
    {
        loopCount = 0;
        airQualityMonitor.upload(configuration);
    }

    loopCount++;
    delay(5000);
}
