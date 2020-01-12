import { combineReducers } from "redux";
import { AppState } from "../entity/AppState";
import { airQualityDataReducer } from './AirQualityDataReducer';
import { airStatusReducer } from "./AirStatusReducer";
import { currentDeviceReducer } from "./CurrentDeviceReducer";
import { devicesReducer } from "./DevicesReducer";
import { loginStatusReducer } from "./LoginStatusReducer";
import { settingsReducer } from "./SettingsReducer";
import { suggestionsReducer } from './SuggestionsReducer';
import { tokenReducer } from "./TokenReducer";

export const appReducer = combineReducers<AppState>({
    airQualityData: airQualityDataReducer,
    airStatus: airStatusReducer,
    devices: devicesReducer,
    currentDevice: currentDeviceReducer,
    suggestions: suggestionsReducer,
    token: tokenReducer,
    loginStatus: loginStatusReducer,
    settings: settingsReducer
});