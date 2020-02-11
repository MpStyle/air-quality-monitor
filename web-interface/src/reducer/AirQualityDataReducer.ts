import { Action } from "redux";
import { FetchAirQualityDataErrorActionName, FetchAirQualityDataStartActionName, FetchAirQualityDataSuccessAction, FetchAirQualityDataSuccessActionName } from '../action/FetchAirQualityDataAction';
import { FetchDevicesSuccessAction, FetchDevicesSuccessActionName } from "../action/FetchDevicesAction";
import { AIR_QUALITY_DATA_CO2_KEY, AIR_QUALITY_DATA_HUMIDITY_KEY, AIR_QUALITY_DATA_INSERTED_KEY, AIR_QUALITY_DATA_PRESSURE_KEY, AIR_QUALITY_DATA_TEMPERATURE_KEY, AIR_QUALITY_DATA_TVOC_KEY } from '../book/LocalStorageKeys';
import { localStorageManager } from "../book/LocalStorageManager";
import { AirQualityData } from "../entity/AirQualityData";
import { LoadingState } from "../entity/LoadingState";
import { initialAppState } from "../store/InitialAppState";

export const airQualityDataReducer = (state: AirQualityData = initialAppState.airQualityData, action: Action): AirQualityData => {
    switch (action.type) {
        case FetchDevicesSuccessActionName:
            const updateDevicesAction = action as FetchDevicesSuccessAction;
            if (!updateDevicesAction.devices || !updateDevicesAction.devices.length) {
                localStorageManager.removeItem(AIR_QUALITY_DATA_CO2_KEY);
                localStorageManager.removeItem(AIR_QUALITY_DATA_HUMIDITY_KEY);
                localStorageManager.removeItem(AIR_QUALITY_DATA_INSERTED_KEY);
                localStorageManager.removeItem(AIR_QUALITY_DATA_PRESSURE_KEY);
                localStorageManager.removeItem(AIR_QUALITY_DATA_TEMPERATURE_KEY);
                localStorageManager.removeItem(AIR_QUALITY_DATA_TVOC_KEY);
                return {} as AirQualityData;
            }
            break;
        case FetchAirQualityDataSuccessActionName:
            const updateAirQualityDataAction = action as FetchAirQualityDataSuccessAction;
            localStorageManager.setItem(AIR_QUALITY_DATA_CO2_KEY, updateAirQualityDataAction.data.co2);
            localStorageManager.setItem(AIR_QUALITY_DATA_HUMIDITY_KEY, updateAirQualityDataAction.data.humidity);
            localStorageManager.setItem(AIR_QUALITY_DATA_INSERTED_KEY, updateAirQualityDataAction.data.inserted);
            localStorageManager.setItem(AIR_QUALITY_DATA_PRESSURE_KEY, updateAirQualityDataAction.data.pressure);
            localStorageManager.setItem(AIR_QUALITY_DATA_TEMPERATURE_KEY, updateAirQualityDataAction.data.temperature);
            localStorageManager.setItem(AIR_QUALITY_DATA_TVOC_KEY, updateAirQualityDataAction.data.tvoc);
            return { ...updateAirQualityDataAction.data, loadingState: LoadingState.success };
        case FetchAirQualityDataStartActionName: return { ...state, loadingState: LoadingState.loading };
        case FetchAirQualityDataErrorActionName: return { ...state, loadingState: LoadingState.error };
    }
    return state;
};