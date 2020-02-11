import { co2Quality, humidityQuality, temperatureQuality, tvocQuality } from '../book/AirQuality';
import { defaultDecimalSeparator } from '../book/DefaultDecimalSeparator';
import { IconVisualizationType } from '../book/IconVisualizationType';
import { TOKEN_KEY } from '../book/SessionStorageKeys';
import { TemperatureUnit } from '../book/Unit';
import { AirQualityData } from '../entity/AirQualityData';
import { AirQuality, AirStatus } from '../entity/AirStatus';
import { LoadingState } from '../entity/LoadingState';
import { LoginStatus } from '../entity/LoginStatus';
import { AIR_QUALITY_DATA_CO2_KEY, AIR_QUALITY_DATA_CURRENT_DEVICE_KEY, AIR_QUALITY_DATA_HUMIDITY_KEY, AIR_QUALITY_DATA_ICON_LABEL_VISUALIZATION_TYPE_KEY, AIR_QUALITY_DATA_INSERTED_KEY, AIR_QUALITY_DATA_PRESSURE_KEY, AIR_QUALITY_DATA_SUGGESTIONS_KEY, AIR_QUALITY_DATA_TEMPERATURE_KEY, AIR_QUALITY_DATA_TVOC_KEY, TEMPERATURE_UNIT_KEY } from './../book/LocalStorageKeys';
import { AppState } from './../entity/AppState';

const currentDevice = localStorage.getItem(AIR_QUALITY_DATA_CURRENT_DEVICE_KEY);
const token = sessionStorage.getItem(TOKEN_KEY);
const suggestions = sessionStorage.getItem(AIR_QUALITY_DATA_SUGGESTIONS_KEY);

export const initialAppState: AppState = {
    airQualityData: {
        inserted: parseFloat(localStorage.getItem(AIR_QUALITY_DATA_INSERTED_KEY) as string),
        co2: parseFloat(localStorage.getItem(AIR_QUALITY_DATA_CO2_KEY) as string),
        tvoc: parseFloat(localStorage.getItem(AIR_QUALITY_DATA_TVOC_KEY) as string),
        pressure: parseFloat(localStorage.getItem(AIR_QUALITY_DATA_PRESSURE_KEY) as string),
        humidity: parseFloat(localStorage.getItem(AIR_QUALITY_DATA_HUMIDITY_KEY) as string),
        temperature: parseFloat(localStorage.getItem(AIR_QUALITY_DATA_TEMPERATURE_KEY) as string),
        loadingState: LoadingState.none
    } as AirQualityData,
    airStatus: {
        co2: co2Quality(parseFloat(localStorage.getItem(AIR_QUALITY_DATA_CO2_KEY) as string)),
        humidity: humidityQuality(parseFloat(localStorage.getItem(AIR_QUALITY_DATA_HUMIDITY_KEY) as string)),
        pressure: AirQuality.Excellent,
        temperature: temperatureQuality(parseFloat(localStorage.getItem(AIR_QUALITY_DATA_TEMPERATURE_KEY) as string)),
        tvoc: tvocQuality(parseFloat(localStorage.getItem(AIR_QUALITY_DATA_TVOC_KEY) as string)),
    } as AirStatus,
    devicesData: {
        devices: currentDevice ? [JSON.parse(currentDevice as string)] : [],
        loadingState: LoadingState.none,
        deletingState: LoadingState.none
    },
    currentDevice: currentDevice ? JSON.parse(currentDevice as string) : null,
    suggestionsData: {
        suggestions: suggestions ? JSON.parse(suggestions) : [],
        loadingState: LoadingState.none
    },
    token: token ? JSON.parse(token as string) : null,
    loginStatus: LoginStatus.None,
    settings: {
        iconVisualizationType: localStorage.getItem(AIR_QUALITY_DATA_ICON_LABEL_VISUALIZATION_TYPE_KEY) || IconVisualizationType.icon,
        decimalSeparator: defaultDecimalSeparator(),
        meterUnit: {
            co2: "ppm",
            tvoc: "ppb",
            pressure: "hPa",
            humidity: "% RH",
            noise: "db",
            temperature: localStorage.getItem(TEMPERATURE_UNIT_KEY) ?? TemperatureUnit.CELSIUS,
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