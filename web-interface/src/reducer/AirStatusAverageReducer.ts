import { Action } from "redux";
import { UpdateAirStatusAverageAction, UpdateAirStatusAverageActionName } from "../action/UpdateAirStatusAverageAction";
import { LocalStorageKey } from "../book/LocalStorageKey";
import { localStorageManager } from "../book/LocalStorageManager";
import { AirQuality } from "../entity/AirStatus";
import { initialAppState } from "../store/InitialAppState";

export const airStatusAverageReducer = (state: AirQuality = initialAppState.airStatusAverage, action: Action): AirQuality => {
    switch (action.type) {
        case UpdateAirStatusAverageActionName:
            const updateAirStatusAverageAction = action as UpdateAirStatusAverageAction;

            localStorageManager.setItem(LocalStorageKey.AIR_STATUS_AVERAGE_KEY, updateAirStatusAverageAction.airStatusAverage);

            return updateAirStatusAverageAction.airStatusAverage;
    }
    return state;
};