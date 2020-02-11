import { co2Quality, humidityQuality, temperatureQuality, tvocQuality } from '../book/AirQuality';
import { defaultDecimalSeparator } from '../book/DefaultDecimalSeparator';
import { IconVisualizationType } from '../book/IconVisualizationType';
import { localStorageManager } from '../book/LocalStorageManager';
import { sessionStorageManager } from '../book/SessionStorageManager';
import { TemperatureUnit } from '../book/Unit';
import { AirQualityData } from '../entity/AirQualityData';
import { AirQuality, AirStatus } from '../entity/AirStatus';
import { Device } from '../entity/Device';
import { LoadingState } from '../entity/LoadingState';
import { LoginStatus } from '../entity/LoginStatus';
import { LocalStorageKey } from './../book/LocalStorageKey';
import { SessionStorageKey } from './../book/SessionStorageKey';
import { AppState } from './../entity/AppState';

const currentDevice = localStorageManager.getItem<Device>(LocalStorageKey.CURRENT_DEVICE_KEY);

export const initialAppState: AppState = {
    airQualityData: {
        inserted: localStorageManager.getItem(LocalStorageKey.INSERTED_KEY),
        co2: localStorageManager.getItem(LocalStorageKey.CO2_KEY),
        tvoc: localStorageManager.getItem(LocalStorageKey.TVOC_KEY),
        pressure: localStorageManager.getItem(LocalStorageKey.PRESSURE_KEY),
        humidity: localStorageManager.getItem(LocalStorageKey.HUMIDITY_KEY),
        temperature: localStorageManager.getItem(LocalStorageKey.TEMPERATURE_KEY),
        loadingState: LoadingState.none
    } as AirQualityData,
    airStatus: {
        co2: co2Quality(localStorageManager.getItem(LocalStorageKey.CO2_KEY) ?? AirQuality.VeryBad),
        humidity: humidityQuality(localStorageManager.getItem(LocalStorageKey.HUMIDITY_KEY) ?? AirQuality.VeryBad),
        pressure: AirQuality.Excellent,
        temperature: temperatureQuality(localStorageManager.getItem(LocalStorageKey.TEMPERATURE_KEY) ?? AirQuality.VeryBad),
        tvoc: tvocQuality(localStorageManager.getItem(LocalStorageKey.TVOC_KEY) ?? AirQuality.VeryBad),
    } as AirStatus,
    devicesData: {
        devices: currentDevice ? [currentDevice] : [],
        loadingState: LoadingState.none,
        deletingState: LoadingState.none
    },
    currentDevice: currentDevice,
    suggestionsData: {
        suggestions: sessionStorageManager.getItem(LocalStorageKey.SUGGESTIONS_KEY) ?? [],
        loadingState: LoadingState.none
    },
    token: sessionStorageManager.getItem(SessionStorageKey.TOKEN_KEY),
    loginStatus: LoginStatus.None,
    settings: {
        iconVisualizationType: localStorageManager.getItem(LocalStorageKey.ICON_LABEL_VISUALIZATION_TYPE_KEY) || IconVisualizationType.icon,
        decimalSeparator: defaultDecimalSeparator(),
        meterUnit: {
            co2: "ppm",
            tvoc: "ppb",
            pressure: "hPa",
            humidity: "% RH",
            noise: "db",
            temperature: localStorageManager.getItem(LocalStorageKey.TEMPERATURE_UNIT_KEY) ?? TemperatureUnit.CELSIUS,
        }
    },
    airQualityDataAverages: {
        yearlyAverages: [],
        monthlyAverages: [],
        dailyAverages: [],
        loadingState: LoadingState.none
    },
    appErrors: []
};