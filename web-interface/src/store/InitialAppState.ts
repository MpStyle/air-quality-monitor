import { co2Quality, humidityQuality, temperatureQuality, tvocQuality } from '../book/AirQuality';
import { TemperatureUnit } from '../book/Unit';
import { AirQualityData } from '../entity/AirQualityData';
import { AirQuality, AirStatus } from '../entity/AirStatus';
import { AIR_QUALITY_DATA_CO2_KEY, AIR_QUALITY_DATA_HUMIDITY_KEY, AIR_QUALITY_DATA_INSERTED_KEY, AIR_QUALITY_DATA_PRESSURE_KEY, AIR_QUALITY_DATA_TEMPERATURE_KEY, AIR_QUALITY_DATA_TVOC_KEY, TEMPERATURE_UNIT_KEY } from './../book/LocalStorageKeys';
import { SECRET_KEY_KEY } from './../book/SessionStorageKeys';
import { AppState } from './../entity/AppState';

export const initialAppState: AppState = {
    airQualityData: {
        inserted: parseFloat(localStorage.getItem(AIR_QUALITY_DATA_INSERTED_KEY) as string),
        co2: parseFloat(localStorage.getItem(AIR_QUALITY_DATA_CO2_KEY) as string),
        tvoc: parseFloat(localStorage.getItem(AIR_QUALITY_DATA_TVOC_KEY) as string),
        pressure: parseFloat(localStorage.getItem(AIR_QUALITY_DATA_PRESSURE_KEY) as string),
        humidity: parseFloat(localStorage.getItem(AIR_QUALITY_DATA_HUMIDITY_KEY) as string),
        temperature: parseFloat(localStorage.getItem(AIR_QUALITY_DATA_TEMPERATURE_KEY) as string),
    } as AirQualityData,
    meterUnit: {
        co2: "ppm",
        tvoc: "ppb",
        pressure: "hPa",
        humidity: "% RH",
        noise: "db",
        temperature: localStorage.getItem(TEMPERATURE_UNIT_KEY) ?? TemperatureUnit.CELSIUS,
    },
    airStatus: {
        co2: co2Quality(parseFloat(localStorage.getItem(AIR_QUALITY_DATA_CO2_KEY) as string)),
        humidity: humidityQuality(parseFloat(localStorage.getItem(AIR_QUALITY_DATA_HUMIDITY_KEY) as string)),
        pressure: AirQuality.Excellent,
        temperature: temperatureQuality(parseFloat(localStorage.getItem(AIR_QUALITY_DATA_TEMPERATURE_KEY) as string)),
        tvoc: tvocQuality(parseFloat(localStorage.getItem(AIR_QUALITY_DATA_TVOC_KEY) as string)),
    } as AirStatus,
    devices: [],
    currentDevice: null,
    suggestions: [],
    secretKey: sessionStorage.getItem(SECRET_KEY_KEY)
};