import { Action } from "redux";
import { FetchAirQualityDataErrorAction, FetchAirQualityDataErrorActionName } from "../action/FetchAirQualityDataAction";
import { FetchDevicesErrorAction, FetchDevicesErrorActionName } from "../action/FetchDevicesAction";
import { FetchTimeRangeErrorAction, FetchTimeRangeErrorActionName } from "../action/FetchTimeRangeAction";
import { AppError } from "../entity/AppError";
import { initialAppState } from "../store/InitialAppState";

export const appErrorsReducer = (state: AppError[] = initialAppState.appErrors, action: Action): AppError[] => {
    switch (action.type) {
        case FetchDevicesErrorActionName:
            return [...state, { code: (action as FetchDevicesErrorAction).error, dateTime: Date.now(), description: "Error calling fetch devices" }];

        case FetchAirQualityDataErrorActionName:
            return [...state, { code: (action as FetchAirQualityDataErrorAction).error, dateTime: Date.now(), description: "Error calling fetch air quality data" }];

        case FetchTimeRangeErrorActionName:
            return [...state, { code: (action as FetchTimeRangeErrorAction).error, dateTime: Date.now(), description: "Error calling fetch time range data" }];
    }

    return state;
};