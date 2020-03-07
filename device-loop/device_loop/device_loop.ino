#include "Adafruit_CCS811.h"
#include <Wire.h>
#include <Adafruit_BMP280.h>

#define SEALEVELPRESSURE_HPA (1013.25)

Adafruit_CCS811 ccs_5a;
Adafruit_CCS811 ccs_5b;
Adafruit_BMP280 bmp; 
 
void setup() {
  Serial.begin(9600);
   
 Serial.println("CCS811 test");
   
  if(!ccs_5a.begin(0x5a)){
    Serial.println("Failed to start sensor! Please check your wiring.");
    while(1);
  }

  if(!ccs_5b.begin(0x5b)){
    Serial.println("Failed to start sensor! Please check your wiring.");
    while(1);
  }
   
  //calibrate temperature sensor
  while(!ccs_5a.available());
  while(!ccs_5b.available());
  
  ccs_5a.setTempOffset(ccs_5a.calculateTemperature() - 25.0);
  ccs_5b.setTempOffset(ccs_5b.calculateTemperature() - 25.0);

  Serial.println(F("BMP280 test"));

  if (!bmp.begin(0x76)) {
    Serial.println(F("Could not find a valid BMP280 sensor, check wiring!"));
    while (1);
  }

  /* Default settings from datasheet. */
  bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,     /* Operating Mode. */
                  Adafruit_BMP280::SAMPLING_X2,     /* Temp. oversampling */
                  Adafruit_BMP280::SAMPLING_X16,    /* Pressure oversampling */
                  Adafruit_BMP280::FILTER_X16,      /* Filtering. */
                  Adafruit_BMP280::STANDBY_MS_500); /* Standby time. */
}
 
void loop() {
  if(ccs_5a.available()){
    float temp_5a = ccs_5a.calculateTemperature();
   
    if(!ccs_5a.readData()){
      Serial.print("5a - CO2: ");
      Serial.print(ccs_5a.geteCO2());
      Serial.print("5a - ppm, TVOC: ");
      Serial.print(ccs_5a.getTVOC());
      Serial.print("5a - ppb Temp:");
      Serial.println(temp_5a);
    }
    else{
      Serial.println("ERROR!");
      while(1);
    }
  }

  if(ccs_5b.available()){
    float temp_5b = ccs_5b.calculateTemperature();
    
    if(!ccs_5b.readData()){
      Serial.print("5b - CO2: ");
      Serial.print(ccs_5b.geteCO2());
      Serial.print("5b - ppm, TVOC: ");
      Serial.print(ccs_5b.getTVOC());
      Serial.print("5b - ppb Temp:");
      Serial.println(temp_5b);
    }
    else{
      Serial.println("ERROR!");
     while(1);
    }
  }

      Serial.print(F("BMP280  - Temperature = "));
    Serial.print(bmp.readTemperature());
    Serial.println(" *C");

    Serial.print(F("BMP280  - Pressure = "));
    Serial.print(bmp.readPressure());
    Serial.println(" Pa");

    Serial.print(F("BMP280  - Approx altitude = "));
    Serial.print(bmp.readAltitude(1013.25)); /* Adjusted to local forecast! */
    Serial.println(" m");
  
  delay(1000);
}
