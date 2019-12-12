import { combineReducers } from "redux";
import { AppState } from "../entity/AppState";
import { initialAppState } from './../store/InitialAppState';
import { airQualityDataReducer } from './AirQualityDataReducer';
import { airStatusReducer } from "./AirStatusReducer";
import { currentDeviceReducer } from "./CurrentDeviceReducer";
import { devicesReducer } from "./DevicesReducer";
import { secretKeyReducer } from "./SecretKeyReducer";
import { suggestionsReducer } from './SuggestionsReducer';

export const appReducer = combineReducers<AppState>({
    airQualityData: airQualityDataReducer,
    meterUnit: () => initialAppState.meterUnit,
    airStatus: airStatusReducer,
    devices: devicesReducer,
    currentDevice: currentDeviceReducer,
    suggestions: suggestionsReducer,
    secretKey: secretKeyReducer
});