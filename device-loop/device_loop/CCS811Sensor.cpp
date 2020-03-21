#include "CCS811Sensor.h"

bool CCS811Sensor::setup()
{
    pinMode(this->RESET_PIN_5A, OUTPUT);
    digitalWrite(this->RESET_PIN_5A, HIGH);
    delay(200);

    pinMode(this->RESET_PIN_5B, OUTPUT);
    digitalWrite(this->RESET_PIN_5B, HIGH);
    delay(200);

    if (!ccs_5a.begin(0x5a))
    {
        Serial.println("Failed to start sensor! Please check your wiring.");
        return false;
    }

    if (!ccs_5b.begin(0x5b))
    {
        Serial.println("Failed to start sensor! Please check your wiring.");
        return false;
    }

    while (!ccs_5a.available())
        ;
    while (!ccs_5b.available())
        ;

    ccs_5a.setTempOffset(ccs_5a.calculateTemperature() - 25.0);
    ccs_5b.setTempOffset(ccs_5b.calculateTemperature() - 25.0);

    return true;
}

CCS811Data CCS811Sensor::getData()
{
    CCS811Data toReturn;
    float ccs_5a_temperature = NAN;
    float ccs_5a_co2 = NAN;
    float ccs_5a_tvoc = NAN;
    float ccs_5b_temperature = NAN;
    float ccs_5b_co2 = NAN;
    float ccs_5b_tvoc = NAN;

    if (this->ccs_5a.available() && !this->ccs_5a.readData())
    {
        ccs_5a_temperature = this->ccs_5a.calculateTemperature();
        ccs_5a_co2 = this->ccs_5a.geteCO2();
        ccs_5a_tvoc = this->ccs_5a.getTVOC();
    }

    if (this->ccs_5b.available() && !this->ccs_5b.readData())
    {
        ccs_5b_temperature = this->ccs_5b.calculateTemperature();
        ccs_5b_co2 = this->ccs_5b.geteCO2();
        ccs_5b_tvoc = this->ccs_5b.getTVOC();
    }

    if (ccs_5a_temperature != NAN && ccs_5b_temperature != NAN && ccs_5a_temperature - ccs_5b_temperature <= CCS811Sensor::DELTA_TEMPERATURE)
    {
        toReturn.temperature = (ccs_5a_temperature + ccs_5b_temperature) / 2;
    }
    else
    {
        toReturn.temperature = NAN;
    }

    if (ccs_5a_co2 != NAN && ccs_5b_co2 != NAN && ccs_5a_co2 - ccs_5b_co2 <= CCS811Sensor::DELTA_CO2)
    {
        toReturn.co2 = (ccs_5a_co2 + ccs_5b_co2) / 2;
    }
    else
    {
        toReturn.co2 = NAN;
    }

    if (ccs_5a_tvoc != NAN && ccs_5b_tvoc != NAN && ccs_5a_tvoc - ccs_5b_tvoc <= CCS811Sensor::DELTA_TVOC)
    {
        toReturn.tvoc = (ccs_5a_tvoc + ccs_5b_tvoc) / 2;
    }
    else
    {
        toReturn.tvoc = NAN;
    }

    if (this->readingCount > this->READINGS_BEFORE_RESET_COUNT)
    {
        Serial.println("Reseting CCS811 sensor..");

        digitalWrite(this->RESET_PIN_5A, LOW);
        digitalWrite(this->RESET_PIN_5B, LOW);
        delay(500);
        digitalWrite(this->RESET_PIN_5A, HIGH);
        digitalWrite(this->RESET_PIN_5B, HIGH);
        delay(200);
        this->readingCount = 0;
    }
    this->readingCount++;

    return toReturn;
}
