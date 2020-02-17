import { Action } from "redux";
import { FetchDevicesSuccessAction, FetchDevicesSuccessActionName } from "../action/FetchDevicesAction";
import { UpdateLastReadingsAction, UpdateLastReadingsActionName } from "../action/UpdateLastReadingsAction";
import { LocalStorageKey } from "../book/LocalStorageKey";
import { localStorageManager } from "../book/LocalStorageManager";
import { AirQualityData } from "../entity/AirQualityData";
import { initialAppState } from "../store/InitialAppState";

export const lastReadingsReducer = (state: AirQualityData = initialAppState.lastReadings, action: Action): AirQualityData => {
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
        case UpdateLastReadingsActionName:
            const updateAirQualityDataAction = action as UpdateLastReadingsAction;
            localStorageManager.setItem(LocalStorageKey.CO2_KEY, updateAirQualityDataAction.data.co2);
            localStorageManager.setItem(LocalStorageKey.HUMIDITY_KEY, updateAirQualityDataAction.data.humidity);
            localStorageManager.setItem(LocalStorageKey.INSERTED_KEY, updateAirQualityDataAction.data.inserted);
            localStorageManager.setItem(LocalStorageKey.PRESSURE_KEY, updateAirQualityDataAction.data.pressure);
            localStorageManager.setItem(LocalStorageKey.TEMPERATURE_KEY, updateAirQualityDataAction.data.temperature);
            localStorageManager.setItem(LocalStorageKey.TVOC_KEY, updateAirQualityDataAction.data.tvoc);
            return { ...updateAirQualityDataAction.data };
    }
    return state;
};