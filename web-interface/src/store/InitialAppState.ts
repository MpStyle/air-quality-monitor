import { AirQualityData } from '../entity/AirQualityData';
import { AirStatus } from '../entity/AirStatus';
import { AppState } from './../entity/AppState';

export const initialAppState: AppState = {
    airQualityData: {} as AirQualityData,
    meterUnit: {
        co2: "ppm",
        tvoc: "ppb",
        pressure: "hPa",
        humidity: "% RH",
        noise: "db",
        temperature: "°C",
    },
    airStatus: {} as AirStatus,
    devices: [],
    currentDevice: null,
    suggestions: []
};