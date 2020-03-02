import { Action } from "redux";
import { FetchDevicesSuccessAction, FetchDevicesSuccessActionName } from "../action/FetchDevicesAction";
import { FetchLastReadingsSuccessAction, FetchLastReadingsSuccessActionName } from "../action/FetchLastReadingsAction";
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
        case FetchLastReadingsSuccessActionName:
            const airQualityData = (action as FetchLastReadingsSuccessAction).lastReadings?.data as AirQualityData;

            localStorageManager.setItem(LocalStorageKey.CO2_KEY, airQualityData.co2);
            localStorageManager.setItem(LocalStorageKey.HUMIDITY_KEY, airQualityData.humidity);
            localStorageManager.setItem(LocalStorageKey.INSERTED_KEY, airQualityData.inserted);
            localStorageManager.setItem(LocalStorageKey.PRESSURE_KEY, airQualityData.pressure);
            localStorageManager.setItem(LocalStorageKey.TEMPERATURE_KEY, airQualityData.temperature);
            localStorageManager.setItem(LocalStorageKey.TVOC_KEY, airQualityData.tvoc);

            return { ...airQualityData };
    }
    return state;
};