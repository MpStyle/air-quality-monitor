import { co2Quality, humidityQuality, temperatureQuality, tvocQuality } from '../book/AirQuality';
import { defaultDecimalSeparator } from '../book/DefaultDecimalSeparator';
import { TemperatureUnit } from '../book/Unit';
import { AirQualityData } from '../entity/AirQualityData';
import { AirQuality, AirStatus } from '../entity/AirStatus';
import { LoginStatus } from '../entity/LoginStatus';
import { AIR_QUALITY_DATA_CO2_KEY, AIR_QUALITY_DATA_CURRENT_DEVICE_ID_KEY, AIR_QUALITY_DATA_HUMIDITY_KEY, AIR_QUALITY_DATA_INSERTED_KEY, AIR_QUALITY_DATA_PRESSURE_KEY, AIR_QUALITY_DATA_TEMPERATURE_KEY, AIR_QUALITY_DATA_TVOC_KEY, TEMPERATURE_UNIT_KEY } from './../book/LocalStorageKeys';
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
    currentDevice: localStorage.getItem(AIR_QUALITY_DATA_CURRENT_DEVICE_ID_KEY),
    suggestions: [],
    token: null,
    decimalSeparator: defaultDecimalSeparator(),
    loginStatus: LoginStatus.None
};