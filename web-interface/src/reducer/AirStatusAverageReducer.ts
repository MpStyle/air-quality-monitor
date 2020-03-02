import { Action } from "redux";
import { FetchLastReadingsSuccessAction, FetchLastReadingsSuccessActionName } from "../action/FetchLastReadingsAction";
import { LocalStorageKey } from "../book/LocalStorageKey";
import { localStorageManager } from "../book/LocalStorageManager";
import { AirQuality } from "../entity/AirStatus";
import { initialAppState } from "../store/InitialAppState";

export const airStatusAverageReducer = (state: AirQuality = initialAppState.airStatusAverage, action: Action): AirQuality => {
    switch (action.type) {
        case FetchLastReadingsSuccessActionName:
            const airQuality = (action as FetchLastReadingsSuccessAction).lastReadings?.averageStatus as AirQuality;

            localStorageManager.setItem(LocalStorageKey.AIR_STATUS_AVERAGE_KEY, airQuality);

            return airQuality;
    }
    return state;
};