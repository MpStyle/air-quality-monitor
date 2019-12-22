import { co2Quality, humidityQuality, temperatureQuality, tvocQuality } from '../book/AirQuality';
import { AirQualityData } from '../entity/AirQualityData';
import { AirQuality, AirStatus } from '../entity/AirStatus';
import { AIR_QUALITY_DATA_CO2_KEY, AIR_QUALITY_DATA_HUMIDITY_KEY, AIR_QUALITY_DATA_INSERTED_KEY, AIR_QUALITY_DATA_PRESSURE_KEY, AIR_QUALITY_DATA_TEMPERATURE_KEY, AIR_QUALITY_DATA_TVOC_KEY, SECRET_KEY_KEY } from './../book/SessionStorageKeys';
import { AppState } from './../entity/AppState';

export const initialAppState: AppState = {
    airQualityData: {
        inserted: parseFloat(sessionStorage.getItem(AIR_QUALITY_DATA_INSERTED_KEY) as string),
        co2: parseFloat(sessionStorage.getItem(AIR_QUALITY_DATA_CO2_KEY) as string),
        tvoc: parseFloat(sessionStorage.getItem(AIR_QUALITY_DATA_TVOC_KEY) as string),
        pressure: parseFloat(sessionStorage.getItem(AIR_QUALITY_DATA_PRESSURE_KEY) as string),
        humidity: parseFloat(sessionStorage.getItem(AIR_QUALITY_DATA_HUMIDITY_KEY) as string),
        temperature: parseFloat(sessionStorage.getItem(AIR_QUALITY_DATA_TEMPERATURE_KEY) as string),
    } as AirQualityData,
    meterUnit: {
        co2: "ppm",
        tvoc: "ppb",
        pressure: "hPa",
        humidity: "% RH",
        noise: "db",
        temperature: "°C",
    },
    airStatus: {
        co2: co2Quality(parseFloat(sessionStorage.getItem(AIR_QUALITY_DATA_CO2_KEY) as string)),
        humidity: humidityQuality(parseFloat(sessionStorage.getItem(AIR_QUALITY_DATA_HUMIDITY_KEY) as string)),
        pressure: AirQuality.Excellent,
        temperature: temperatureQuality(parseFloat(sessionStorage.getItem(AIR_QUALITY_DATA_TEMPERATURE_KEY) as string)),
        tvoc: tvocQuality(parseFloat(sessionStorage.getItem(AIR_QUALITY_DATA_TVOC_KEY) as string)),
    } as AirStatus,
    devices: [],
    currentDevice: null,
    suggestions: [],
    secretKey: sessionStorage.getItem(SECRET_KEY_KEY)
};