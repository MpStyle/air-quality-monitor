import { Action } from "redux";
import { FetchDevicesErrorActionName, FetchDevicesStartActionName, FetchDevicesSuccessAction, FetchDevicesSuccessActionName } from "../action/FetchDevicesAction";
import { DevicesData } from "../entity/DevicesData";
import { LoadingState } from "../entity/LoadingState";
import { initialAppState } from "../store/InitialAppState";

export const devicesDataReducer = (state: DevicesData = initialAppState.devicesData, action: Action): DevicesData => {
    switch (action.type) {
        case FetchDevicesSuccessActionName:
            const updateDevicesAction = action as FetchDevicesSuccessAction;
            return {
                devices: updateDevicesAction.devices,
                loadingState: LoadingState.success
            };
        case FetchDevicesStartActionName:
            return {
                devices: state.devices,
                loadingState: LoadingState.loading
            };
        case FetchDevicesErrorActionName:
            return {
                devices: state.devices,
                loadingState: LoadingState.error
            };
    }
    return state;
};