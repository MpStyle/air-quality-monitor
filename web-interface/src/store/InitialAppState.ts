import { defaultDecimalSeparator } from '../book/DefaultDecimalSeparator';
import { IconVisualizationType } from '../book/IconVisualizationType';
import { localStorageManager } from '../book/LocalStorageManager';
import { sessionStorageManager } from '../book/SessionStorageManager';
import { TemperatureUnit } from '../book/Unit';
import { AirQualityData } from '../entity/AirQualityData';
import { AirQuality, AirStatus } from '../entity/AirStatus';
import { DateFormat } from '../entity/DateFormat';
import { Device } from '../entity/Device';
import { LoadingState } from '../entity/LoadingState';
import { ShortDateFormat } from '../entity/ShortDateFormat';
import { LocalStorageKey } from './../book/LocalStorageKey';
import { SessionStorageKey } from './../book/SessionStorageKey';
import { AppState } from './../entity/AppState';

const currentDevice = localStorageManager.getItem<Device>(LocalStorageKey.CURRENT_DEVICE_KEY);

export const initialAppState: AppState = {
    lastReadingLoadingState: LoadingState.none,
    lastReadings: {
        inserted: localStorageManager.getItem(LocalStorageKey.INSERTED_KEY),
        co2: localStorageManager.getItem(LocalStorageKey.CO2_KEY),
        tvoc: localStorageManager.getItem(LocalStorageKey.TVOC_KEY),
        pressure: localStorageManager.getItem(LocalStorageKey.PRESSURE_KEY),
        humidity: localStorageManager.getItem(LocalStorageKey.HUMIDITY_KEY),
        temperature: localStorageManager.getItem(LocalStorageKey.TEMPERATURE_KEY),
    } as AirQualityData,
    airStatus: {
        co2: localStorageManager.getItem(LocalStorageKey.CO2_STATUS_KEY) ?? AirQuality.VeryBad,
        humidity: localStorageManager.getItem(LocalStorageKey.HUMIDITY_STATUS_KEY) ?? AirQuality.VeryBad,
        pressure: localStorageManager.getItem(LocalStorageKey.PRESSURE_STATUS_KEY) ?? AirQuality.VeryBad,
        temperature: localStorageManager.getItem(LocalStorageKey.TEMPERATURE_STATUS_KEY) ?? AirQuality.VeryBad,
        tvoc: localStorageManager.getItem(LocalStorageKey.TVOC_STATUS_KEY) ?? AirQuality.VeryBad,
    } as AirStatus,
    airStatusAverage: localStorageManager.getItem(LocalStorageKey.AIR_STATUS_AVERAGE_KEY) ?? AirQuality.VeryBad,
    devicesData: {
        devices: currentDevice ? [currentDevice] : [],
        loadingState: LoadingState.none,
        deletingState: LoadingState.none
    },
    currentDevice: currentDevice,
    suggestions: localStorageManager.getItem(LocalStorageKey.SUGGESTIONS_KEY) ?? [],
    loginTokenStatus: {
        loginToken: sessionStorageManager.getItem(SessionStorageKey.TOKEN_KEY),
        loadingState: LoadingState.none,
    },
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
        },
        dateFormat: localStorageManager.getItem(LocalStorageKey.DATE_FORMAT_KEY) ?? DateFormat.YYYY_MINUS_MM_MINUS_DD,
        shortDateFormat: localStorageManager.getItem(LocalStorageKey.SHORT_DATE_FORMAT_KEY) ?? ShortDateFormat.YYYY_MINUS_MM,
    },
    airQualityDataAverages: {
        yearlyAverages: [],
        monthlyAverages: [],
        dailyAverages: [],
        loadingState: LoadingState.none
    },
    appErrors: []
};