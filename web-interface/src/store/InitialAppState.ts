import { co2Quality, humidityQuality, temperatureQuality, tvocQuality } from '../book/AirQuality';
import { AirQualityData } from '../entity/AirQualityData';
import { AirQuality, AirStatus } from '../entity/AirStatus';
import { AIR_QUALITY_DATA_CO2_KEY, AIR_QUALITY_DATA_HUMIDITY_KEY, AIR_QUALITY_DATA_INSERTED_KEY, AIR_QUALITY_DATA_NOISE_KEY, AIR_QUALITY_DATA_PRESSURE_KEY, AIR_QUALITY_DATA_TEMPERATURE_KEY, AIR_QUALITY_DATA_TVOC_KEY, SECRET_KEY_KEY } from './../book/SessionStorageKeys';
import { AppState } from './../entity/AppState';

export const initialAppState: AppState = {
    airQualityData: {
        inserted: parseInt(sessionStorage.getItem(AIR_QUALITY_DATA_INSERTED_KEY) as string),
        co2: parseInt(sessionStorage.getItem(AIR_QUALITY_DATA_CO2_KEY) as string),
        tvoc: parseInt(sessionStorage.getItem(AIR_QUALITY_DATA_TVOC_KEY) as string),
        pressure: parseInt(sessionStorage.getItem(AIR_QUALITY_DATA_PRESSURE_KEY) as string),
        humidity: parseInt(sessionStorage.getItem(AIR_QUALITY_DATA_HUMIDITY_KEY) as string),
        noise: parseInt(sessionStorage.getItem(AIR_QUALITY_DATA_NOISE_KEY) as string),
        temperature: parseInt(sessionStorage.getItem(AIR_QUALITY_DATA_TEMPERATURE_KEY) as string),
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
        co2: co2Quality(parseInt(sessionStorage.getItem(AIR_QUALITY_DATA_CO2_KEY) as string)),
        humidity: humidityQuality(parseInt(sessionStorage.getItem(AIR_QUALITY_DATA_HUMIDITY_KEY) as string)),
        pressure: AirQuality.Excellent,
        temperature: temperatureQuality(parseInt(sessionStorage.getItem(AIR_QUALITY_DATA_TEMPERATURE_KEY) as string)),
        tvoc: tvocQuality(parseInt(sessionStorage.getItem(AIR_QUALITY_DATA_TVOC_KEY) as string)),
    } as AirStatus,
    devices: [],
    currentDevice: null,
    suggestions: [],
    secretKey: sessionStorage.getItem(SECRET_KEY_KEY)
};