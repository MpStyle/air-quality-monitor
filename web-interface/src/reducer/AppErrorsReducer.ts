import { Action } from "redux";
import { DeleteDeviceErrorAction, DeleteDeviceErrorActionName } from "../action/DeleteDeviceAction";
import { FetchDevicesErrorAction, FetchDevicesErrorActionName } from "../action/FetchDevicesAction";
import { FetchLastReadingsErrorAction, FetchLastReadingsErrorActionName } from "../action/FetchLastReadingsAction";
import { FetchTimeRangeErrorAction, FetchTimeRangeErrorActionName } from "../action/FetchTimeRangeAction";
import { AppError } from "../entity/AppError";
import { initialAppState } from "../store/InitialAppState";

export const appErrorsReducer = (state: AppError[] = initialAppState.appErrors, action: Action): AppError[] => {
    switch (action.type) {
        case FetchDevicesErrorActionName:
            return [...state, { code: (action as FetchDevicesErrorAction).error, dateTime: Date.now(), description: "Error calling fetch devices" }];

        case FetchLastReadingsErrorActionName:
            return [...state, { code: (action as FetchLastReadingsErrorAction).error, dateTime: Date.now(), description: "Error calling fetch air quality data" }];

        case FetchTimeRangeErrorActionName:
            return [...state, { code: (action as FetchTimeRangeErrorAction).error, dateTime: Date.now(), description: "Error calling fetch time range data" }];

        case DeleteDeviceErrorActionName:
            return [...state, { code: (action as DeleteDeviceErrorAction).error, dateTime: Date.now(), description: "Error calling delete device" }];
    }

    return state;
};