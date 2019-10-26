import { AirQuality } from '../entity/AirStatus';
import { AppState } from './../entity/AppState';

export const initialAppState: AppState = {
    airQualityData: {
        inserted: -1,
        co2: 400,
        humidity: 0,
        noise: 0,
        pressure: 300,
        temperature: 0,
        tvoc: 0
    },
    meterUnit: {
        co2: "ppm",
        tvoc: "ppb",
        pressure: "hPa",
        humidity: "% RH",
        noise: "db",
        temperature: "°C",
    },
    airStatus: {
        co2: AirQuality.Excellent,
        humidity: AirQuality.Excellent,
        noise: AirQuality.Excellent,
        pressure: AirQuality.Excellent,
        temperature: AirQuality.Excellent,
        tvoc: AirQuality.Excellent,
    },
    devices: [],
    currentDevice: null,
    suggestions: []
};