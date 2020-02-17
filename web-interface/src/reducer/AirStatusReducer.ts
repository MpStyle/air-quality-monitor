import { Action } from "redux";
import { UpdateAirStatusAction, UpdateAirStatusActionName } from "../action/UpdateAirStatusAction";
import { LocalStorageKey } from "../book/LocalStorageKey";
import { localStorageManager } from "../book/LocalStorageManager";
import { AirStatus } from "../entity/AirStatus";
import { initialAppState } from "../store/InitialAppState";

export const airStatusReducer = (state: AirStatus = initialAppState.airStatus, action: Action): AirStatus => {
    switch (action.type) {
        case UpdateAirStatusActionName:
            const updateAirStatusAction = action as UpdateAirStatusAction;

            localStorageManager.setItem(LocalStorageKey.CO2_STATUS_KEY, updateAirStatusAction.airStatus.co2);
            localStorageManager.setItem(LocalStorageKey.HUMIDITY_STATUS_KEY, updateAirStatusAction.airStatus.humidity);
            localStorageManager.setItem(LocalStorageKey.PRESSURE_STATUS_KEY, updateAirStatusAction.airStatus.pressure);
            localStorageManager.setItem(LocalStorageKey.TEMPERATURE_STATUS_KEY, updateAirStatusAction.airStatus.temperature);
            localStorageManager.setItem(LocalStorageKey.TVOC_STATUS_KEY, updateAirStatusAction.airStatus.tvoc);

            return updateAirStatusAction.airStatus;
    }
    return state;
};