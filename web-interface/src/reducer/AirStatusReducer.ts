import { Action } from "redux";
import { FetchLastReadingsSuccessAction, FetchLastReadingsSuccessActionName } from "../action/FetchLastReadingsAction";
import { LocalStorageKey } from "../book/LocalStorageKey";
import { localStorageManager } from "../book/LocalStorageManager";
import { AirStatus } from "../entity/AirStatus";
import { initialAppState } from "../store/InitialAppState";

export const airStatusReducer = (state: AirStatus = initialAppState.airStatus, action: Action): AirStatus => {
    switch (action.type) {
        case FetchLastReadingsSuccessActionName:
            const airStatus = (action as FetchLastReadingsSuccessAction).lastReadings?.status as AirStatus;

            localStorageManager.setItem(LocalStorageKey.CO2_STATUS_KEY, airStatus.co2);
            localStorageManager.setItem(LocalStorageKey.HUMIDITY_STATUS_KEY, airStatus.humidity);
            localStorageManager.setItem(LocalStorageKey.PRESSURE_STATUS_KEY, airStatus.pressure);
            localStorageManager.setItem(LocalStorageKey.TEMPERATURE_STATUS_KEY, airStatus.temperature);
            localStorageManager.setItem(LocalStorageKey.TVOC_STATUS_KEY, airStatus.tvoc);

            return airStatus;
    }
    return state;
};