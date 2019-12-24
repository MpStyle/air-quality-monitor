import { combineReducers } from "redux";
import { AppState } from "../entity/AppState";
import { airQualityDataReducer } from './AirQualityDataReducer';
import { airStatusReducer } from "./AirStatusReducer";
import { currentDeviceReducer } from "./CurrentDeviceReducer";
import { decimalSeparatorReducer } from './DecimalSeparatorReducer';
import { devicesReducer } from "./DevicesReducer";
import { meterUnitReducer } from "./MeterUnitReducer";
import { suggestionsReducer } from './SuggestionsReducer';
import { tokenReducer } from "./TokenReducer";

export const appReducer = combineReducers<AppState>({
    airQualityData: airQualityDataReducer,
    meterUnit: meterUnitReducer,
    airStatus: airStatusReducer,
    devices: devicesReducer,
    currentDevice: currentDeviceReducer,
    suggestions: suggestionsReducer,
    token: tokenReducer,
    decimalSeparator: decimalSeparatorReducer
});