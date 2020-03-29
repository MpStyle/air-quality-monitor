import { combineReducers } from "redux";
import { AppState } from "../entity/AppState";
import { airQualityDataAveragesReducer } from "./AirQualityDataAveragesReducer";
import { lastReadingsReducer } from './AirQualityDataReducer';
import { airStatusAverageReducer } from "./AirStatusAverageReducer";
import { airStatusReducer } from "./AirStatusReducer";
import { appErrorsReducer } from "./AppErrorsReducer";
import { currentDeviceReducer } from "./CurrentDeviceReducer";
import { devicesDataReducer } from "./DevicesDataReducer";
import { lastReadingLoadingStateReducer } from "./LastReadingLoadingStateReducer";
import { loginTokenStatusReducer } from "./LoginTokenStatusReducer";
import { settingsReducer } from "./SettingsReducer";
import { suggestionsReducer } from './SuggestionsReducer';

export const appReducer = combineReducers<AppState>({
    lastReadingLoadingState: lastReadingLoadingStateReducer,
    lastReadings: lastReadingsReducer,
    airStatus: airStatusReducer,
    devicesData: devicesDataReducer,
    currentDevice: currentDeviceReducer,
    suggestions: suggestionsReducer,
    loginTokenStatus: loginTokenStatusReducer,
    settings: settingsReducer,
    airQualityDataAverages: airQualityDataAveragesReducer,
    appErrors: appErrorsReducer,
    airStatusAverage: airStatusAverageReducer
});