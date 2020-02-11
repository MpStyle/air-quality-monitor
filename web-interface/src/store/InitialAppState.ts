import { co2Quality, humidityQuality, temperatureQuality, tvocQuality } from '../book/AirQuality';
import { defaultDecimalSeparator } from '../book/DefaultDecimalSeparator';
import { IconVisualizationType } from '../book/IconVisualizationType';
import { localStorageManager } from '../book/LocalStorageManager';
import { TOKEN_KEY } from '../book/SessionStorageKeys';
import { sessionStorageManager } from '../book/SessionStorageManager';
import { TemperatureUnit } from '../book/Unit';
import { AirQualityData } from '../entity/AirQualityData';
import { AirQuality, AirStatus } from '../entity/AirStatus';
import { Device } from '../entity/Device';
import { LoadingState } from '../entity/LoadingState';
import { LoginStatus } from '../entity/LoginStatus';
import { AIR_QUALITY_DATA_CO2_KEY, AIR_QUALITY_DATA_CURRENT_DEVICE_KEY, AIR_QUALITY_DATA_HUMIDITY_KEY, AIR_QUALITY_DATA_ICON_LABEL_VISUALIZATION_TYPE_KEY, AIR_QUALITY_DATA_INSERTED_KEY, AIR_QUALITY_DATA_PRESSURE_KEY, AIR_QUALITY_DATA_SUGGESTIONS_KEY, AIR_QUALITY_DATA_TEMPERATURE_KEY, AIR_QUALITY_DATA_TVOC_KEY, TEMPERATURE_UNIT_KEY } from './../book/LocalStorageKeys';
import { AppState } from './../entity/AppState';

const currentDevice = localStorageManager.getItem<Device>(AIR_QUALITY_DATA_CURRENT_DEVICE_KEY);

export const initialAppState: AppState = {
    airQualityData: {
        inserted: localStorageManager.getItem(AIR_QUALITY_DATA_INSERTED_KEY),
        co2: localStorageManager.getItem(AIR_QUALITY_DATA_CO2_KEY),
        tvoc: localStorageManager.getItem(AIR_QUALITY_DATA_TVOC_KEY),
        pressure: localStorageManager.getItem(AIR_QUALITY_DATA_PRESSURE_KEY),
        humidity: localStorageManager.getItem(AIR_QUALITY_DATA_HUMIDITY_KEY),
        temperature: localStorageManager.getItem(AIR_QUALITY_DATA_TEMPERATURE_KEY),
        loadingState: LoadingState.none
    } as AirQualityData,
    airStatus: {
        co2: co2Quality(localStorageManager.getItem(AIR_QUALITY_DATA_CO2_KEY) ?? AirQuality.VeryBad),
        humidity: humidityQuality(localStorageManager.getItem(AIR_QUALITY_DATA_HUMIDITY_KEY) ?? AirQuality.VeryBad),
        pressure: AirQuality.Excellent,
        temperature: temperatureQuality(localStorageManager.getItem(AIR_QUALITY_DATA_TEMPERATURE_KEY) ?? AirQuality.VeryBad),
        tvoc: tvocQuality(localStorageManager.getItem(AIR_QUALITY_DATA_TVOC_KEY) ?? AirQuality.VeryBad),
    } as AirStatus,
    devicesData: {
        devices: currentDevice ? [currentDevice] : [],
        loadingState: LoadingState.none,
        deletingState: LoadingState.none
    },
    currentDevice: currentDevice,
    suggestionsData: {
        suggestions: sessionStorageManager.getItem(AIR_QUALITY_DATA_SUGGESTIONS_KEY) ?? [],
        loadingState: LoadingState.none
    },
    token: sessionStorageManager.getItem(TOKEN_KEY),
    loginStatus: LoginStatus.None,
    settings: {
        iconVisualizationType: localStorageManager.getItem(AIR_QUALITY_DATA_ICON_LABEL_VISUALIZATION_TYPE_KEY) || IconVisualizationType.icon,
        decimalSeparator: defaultDecimalSeparator(),
        meterUnit: {
            co2: "ppm",
            tvoc: "ppb",
            pressure: "hPa",
            humidity: "% RH",
            noise: "db",
            temperature: localStorageManager.getItem(TEMPERATURE_UNIT_KEY) ?? TemperatureUnit.CELSIUS,
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