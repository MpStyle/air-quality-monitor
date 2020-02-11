import { Action } from "redux";
import { FetchAirQualityDataErrorActionName, FetchAirQualityDataStartActionName, FetchAirQualityDataSuccessAction, FetchAirQualityDataSuccessActionName } from '../action/FetchAirQualityDataAction';
import { FetchDevicesSuccessAction, FetchDevicesSuccessActionName } from "../action/FetchDevicesAction";
import { LocalStorageKey } from "../book/LocalStorageKey";
import { localStorageManager } from "../book/LocalStorageManager";
import { AirQualityData } from "../entity/AirQualityData";
import { LoadingState } from "../entity/LoadingState";
import { initialAppState } from "../store/InitialAppState";

export const airQualityDataReducer = (state: AirQualityData = initialAppState.airQualityData, action: Action): AirQualityData => {
    switch (action.type) {
        case FetchDevicesSuccessActionName:
            const updateDevicesAction = action as FetchDevicesSuccessAction;
            if (!updateDevicesAction.devices || !updateDevicesAction.devices.length) {
                localStorageManager.removeItem(LocalStorageKey.CO2_KEY);
                localStorageManager.removeItem(LocalStorageKey.HUMIDITY_KEY);
                localStorageManager.removeItem(LocalStorageKey.INSERTED_KEY);
                localStorageManager.removeItem(LocalStorageKey.PRESSURE_KEY);
                localStorageManager.removeItem(LocalStorageKey.TEMPERATURE_KEY);
                localStorageManager.removeItem(LocalStorageKey.TVOC_KEY);
                return {} as AirQualityData;
            }
            break;
        case FetchAirQualityDataSuccessActionName:
            const updateAirQualityDataAction = action as FetchAirQualityDataSuccessAction;
            localStorageManager.setItem(LocalStorageKey.CO2_KEY, updateAirQualityDataAction.data.co2);
            localStorageManager.setItem(LocalStorageKey.HUMIDITY_KEY, updateAirQualityDataAction.data.humidity);
            localStorageManager.setItem(LocalStorageKey.INSERTED_KEY, updateAirQualityDataAction.data.inserted);
            localStorageManager.setItem(LocalStorageKey.PRESSURE_KEY, updateAirQualityDataAction.data.pressure);
            localStorageManager.setItem(LocalStorageKey.TEMPERATURE_KEY, updateAirQualityDataAction.data.temperature);
            localStorageManager.setItem(LocalStorageKey.TVOC_KEY, updateAirQualityDataAction.data.tvoc);
            return { ...updateAirQualityDataAction.data, loadingState: LoadingState.success };
        case FetchAirQualityDataStartActionName: return { ...state, loadingState: LoadingState.loading };
        case FetchAirQualityDataErrorActionName: return { ...state, loadingState: LoadingState.error };
    }
    return state;
};