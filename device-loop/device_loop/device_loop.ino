#include "Adafruit_CCS811.h"
#include <Wire.h>
#include <Adafruit_BMP280.h>
#include "DHT.h"
#include <WiFi.h>
#include <HTTPClient.h>

const char *WIFI_SSID = "***";
const char *WIFI_PASSWORD = "***";
const char *BACKEND_SERVICE_URL = "***";
const char *DEVICE_ID = "***";
const char *DEVICE_NAME = "***";
const char *DEVICE_ADDRESS = "***";
const char *SECRET_KEY = "***";

const float INVALID_READING = NAN;
const int READINGS_ARRAY_SIZE = 20;
const int LOOP_COUNT_BEFORE_UPLOAD = 600;

Adafruit_CCS811 ccs_5a;
Adafruit_CCS811 ccs_5b;
Adafruit_BMP280 bmp;
DHT dht(4, DHT11);
HTTPClient http;

int loopCount = 0;

int temperatureCount = 0;
float temperatureReadings[READINGS_ARRAY_SIZE] = 0;

int humidityCount = 0;
float humidityReadings[READINGS_ARRAY_SIZE] = 0;

int co2Count = 0;
float co2Readings[READINGS_ARRAY_SIZE] = 0;

int tvocCount = 0;
float tvocReadings[READINGS_ARRAY_SIZE] = 0;

int pressureCount = 0;
float pressureReadings[READINGS_ARRAY_SIZE] = 0;

int altitudeCount = 0;
float altitudeReadings[READINGS_ARRAY_SIZE] = 0;

void setup()
{
  Serial.begin(9600);

  http.begin(BACKEND_SERVICE_URL);
  http.addHeader("Content-Type", "application/json");

  // WIFI settings/connection
  //Delay needed before calling the WiFi.begin
  delay(4000);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }

  Serial.println("Connected to the WiFi network");

  // Sets every array items to INVALID_READING
  for (int i = 0; i < READINGS_ARRAY_SIZE; i++)
    temperatureReadings[i] = INVALID_READING;
  for (int i = 0; i < READINGS_ARRAY_SIZE; i++)
    humidityReadings[i] = INVALID_READING;
  for (int i = 0; i < READINGS_ARRAY_SIZE; i++)
    co2Readings[i] = INVALID_READING;
  for (int i = 0; i < READINGS_ARRAY_SIZE; i++)
    tvocReadings[i] = INVALID_READING;
  for (int i = 0; i < READINGS_ARRAY_SIZE; i++)
    pressureReadings[i] = INVALID_READING;
  for (int i = 0; i < READINGS_ARRAY_SIZE; i++)
    altitudeReadings[i] = INVALID_READING;

  // CCS811 initialization
  Serial.println("CCS811 test");

  if (!ccs_5a.begin(0x5a))
  {
    Serial.println("Failed to start sensor! Please check your wiring.");
    while (1)
      ;
  }

  if (!ccs_5b.begin(0x5b))
  {
    Serial.println("Failed to start sensor! Please check your wiring.");
    while (1)
      ;
  }

  while (!ccs_5a.available())
    ;
  while (!ccs_5b.available())
    ;

  ccs_5a.setTempOffset(ccs_5a.calculateTemperature() - 25.0);
  ccs_5b.setTempOffset(ccs_5b.calculateTemperature() - 25.0);

  // BMP280 initialization
  Serial.println(F("BMP280 test"));

  if (!bmp.begin(0x76))
  {
    Serial.println(F("Could not find a valid BMP280 sensor, check wiring!"));
    while (1)
      ;
  }

  /* Default settings from datasheet. */
  bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,     /* Operating Mode. */
                  Adafruit_BMP280::SAMPLING_X2,     /* Temp. oversampling */
                  Adafruit_BMP280::SAMPLING_X16,    /* Pressure oversampling */
                  Adafruit_BMP280::FILTER_X16,      /* Filtering. */
                  Adafruit_BMP280::STANDBY_MS_500); /* Standby time. */

  // DHT11 initialization
  Serial.println(F("DHT11 test!"));

  dht.begin();
}

void loop()
{
  float temperature = INVALID_READING;
  float co2 = INVALID_READING;
  float tvoc = INVALID_READING;
  float pressure = INVALID_READING;
  float altitude = INVALID_READING;
  float humidity = INVALID_READING;

  float ccs_5a_temperature = INVALID_READING;
  float ccs_5a_co2 = INVALID_READING;
  float ccs_5a_tvoc = INVALID_READING;
  float ccs_5b_temperature = INVALID_READING;
  float ccs_5b_co2 = INVALID_READING;
  float ccs_5b_tvoc = INVALID_READING;

  float bmp280_temperature = INVALID_READING;
  float bmp280_pressure = INVALID_READING;
  float bmp280_altitude = INVALID_READING;

  float dht11_temperature = INVALID_READING;
  float dht11_humidity = INVALID_READING;

  // Resets counters if >= of READINGS_ARRAY_SIZE
  if (temperatureCount >= READINGS_ARRAY_SIZE)
    temperatureCount = 0;

  if (altitudeCount >= READINGS_ARRAY_SIZE)
    altitudeCount = 0;

  if (pressureCount >= READINGS_ARRAY_SIZE * 2)
    pressureCount = 0;

  if (tvocCount >= READINGS_ARRAY_SIZE)
    tvocCount = 0;

  if (co2Count >= READINGS_ARRAY_SIZE)
    co2Count = 0;

  if (humidityCount >= READINGS_ARRAY_SIZE)
    humidityCount = 0;

  // CCS811 - Readings
  if (ccs_5a.available() && !ccs_5a.readData())
  {
    ccs_5a_temperature = ccs_5a.calculateTemperature();
    ccs_5a_co2 = ccs_5a.geteCO2();
    ccs_5a_tvoc = ccs_5a.getTVOC();
  }

  if (ccs_5b.available() && !ccs_5b.readData())
  {
    ccs_5b_temperature = ccs_5b.calculateTemperature();
    ccs_5b_co2 = ccs_5b.geteCO2();
    ccs_5b_tvoc = ccs_5b.getTVOC();
  }

  // BMP280 - Readings
  bmp280_temperature = bmp.readTemperature();
  bmp280_pressure = bmp.readPressure();
  bmp280_altitude = bmp.readAltitude(1013.25);

  // DHT11 - Readings
  dht11_humidity = dht.readHumidity();
  dht11_temperature = dht.readTemperature();

  // --- Averages
  if (ccs_5a_temperature != INVALID_READING && ccs_5b_temperature != INVALID_READING)
  {
    temperature = (ccs_5a_temperature + ccs_5b_temperature) / 2;
  }

  if (ccs_5a_co2 != INVALID_READING && ccs_5b_co2 != INVALID_READING)
  {
    co2 = (ccs_5a_co2 + ccs_5b_co2) / 2;
  }

  if (ccs_5a_tvoc != INVALID_READING && ccs_5b_tvoc != INVALID_READING)
  {
    tvoc = (ccs_5a_tvoc + ccs_5b_tvoc) / 2;
  }

  if (bmp280_temperature != INVALID_READING)
  {
    temperature = (temperature + bmp280_temperature) / 2;
  }

  if (bmp280_pressure != INVALID_READING)
  {
    pressure = bmp280_pressure;
  }

  if (bmp280_altitude != INVALID_READING)
  {
    altitude = bmp280_altitude;
  }

  if (dht11_temperature != INVALID_READING)
  {
    temperature = (temperature + dht11_temperature) / 2;
  }

  if (dht11_humidity != INVALID_READING)
  {
    humidity = dht11_humidity;
  }

  // ---
  if (temperature != INVALID_READING)
  {
    temperatureReadings[temperatureCount++] = temperature;
  }
  if (co2 != INVALID_READING)
  {
    co2Readings[co2Count++] = co2;
  }
  if (tvoc != INVALID_READING)
  {
    tvocReadings[tvocCount++] = tvoc;
  }
  if (humidity != INVALID_READING)
  {
    humidityReadings[humidityCount++] = humidity;
  }
  if (pressure != INVALID_READING)
  {
    pressureReadings[pressureCount++] = pressure;
  }
  if (altitude != INVALID_READING)
  {
    altitudeReadings[altitudeCount++] = altitude;
  }

  loopCount++;

  if (loopCount > LOOP_COUNT_BEFORE_UPLOAD)
  {
    loopCount = 0;
    char *json = "{ \"secretKey\": \"" + SECRET_KEY + "\", \"device\": { \"id\": \"" + DEVICE_ID + "\", \"name\": \"" + DEVICE_NAME + "\", \"address\": \"" + DEVICE_ADDRESS + "\", \"ip\": \"" + WiFi.localIP() + "\" }, \"airData\": { \"temperature\":\"" + temperature + "\", \"co2\":\"" + co2 + "\", \"tvoc\":\"" + tvoc + "\", \"humidity\":\"" + humidity + "\", \"pressure\":\"" + pressure + "\", \"altitude\":\"" + altitude + "\" } }";
    int httpResponseCode = http.POST(json);

    Serial.print("Sending: ");
    Serial.println(json);

    if (httpResponseCode > 0)
    {
      Serial.println("Success on sending POST");
      Serial.println(http.getString());
    }
    else
    {
      Serial.println("Error on sending POST");
    }
    Serial.println(httpResponseCode);
  }

  delay(1000);
}
