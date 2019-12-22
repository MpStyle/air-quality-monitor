import { combineReducers } from "redux";
import { AppState } from "../entity/AppState";
import { airQualityDataReducer } from './AirQualityDataReducer';
import { airStatusReducer } from "./AirStatusReducer";
import { currentDeviceReducer } from "./CurrentDeviceReducer";
import { devicesReducer } from "./DevicesReducer";
import { meterUnitReducer } from "./MeterUnitReducer";
import { secretKeyReducer } from "./SecretKeyReducer";
import { suggestionsReducer } from './SuggestionsReducer';

export const appReducer = combineReducers<AppState>({
    airQualityData: airQualityDataReducer,
    meterUnit: meterUnitReducer,
    airStatus: airStatusReducer,
    devices: devicesReducer,
    currentDevice: currentDeviceReducer,
    suggestions: suggestionsReducer,
    secretKey: secretKeyReducer
});