import { Action } from "redux";
import { FetchLastReadingsErrorActionName, FetchLastReadingsName, FetchLastReadingsSuccessActionName } from '../action/FetchLastReadingsAction';
import { FetchDevicesSuccessAction, FetchDevicesSuccessActionName } from "../action/FetchDevicesAction";
import { LoadingState } from "../entity/LoadingState";
import { initialAppState } from "../store/InitialAppState";

export const lastReadingLoadingStateReducer = (state: LoadingState = initialAppState.lastReadingLoadingState, action: Action): LoadingState => {
    switch (action.type) {
        case FetchDevicesSuccessActionName:
            const updateDevicesAction = action as FetchDevicesSuccessAction;
            if (!updateDevicesAction.devices || !updateDevicesAction.devices.length) {
                return LoadingState.none;
            }
            break;
        case FetchLastReadingsSuccessActionName: return LoadingState.success;
        case FetchLastReadingsName: return LoadingState.loading;
        case FetchLastReadingsErrorActionName: return LoadingState.error;
    }
    return state;
};