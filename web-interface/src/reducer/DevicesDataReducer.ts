import { Action } from "redux";
import { FetchDevicesErrorActionName, FetchDevicesStartActionName, FetchDevicesSuccessAction, FetchDevicesSuccessActionName } from "../action/FetchDevicesAction";
import { DevicesData } from "../entity/DevicesData";
import { LoadingState } from "../entity/LoadingState";
import { initialAppState } from "../store/InitialAppState";
import { DeleteDeviceStartActionName, DeleteDeviceErrorActionName, DeleteDeviceSuccessActionName } from "../action/DeleteDeviceAction";

export const devicesDataReducer = (state: DevicesData = initialAppState.devicesData, action: Action): DevicesData => {
    switch (action.type) {
        case FetchDevicesSuccessActionName:
            const updateDevicesAction = action as FetchDevicesSuccessAction;
            return {
                ...state,
                devices: updateDevicesAction.devices,
                loadingState: LoadingState.success
            };
        case FetchDevicesStartActionName:
            return {
                ...state,
                devices: state.devices,
                loadingState: LoadingState.loading
            };
        case FetchDevicesErrorActionName:
            return {
                ...state,
                devices: state.devices,
                loadingState: LoadingState.error
            };
        case DeleteDeviceStartActionName:
            return {
                ...state,
                deletingState: LoadingState.loading
            };
        case DeleteDeviceErrorActionName:
            return {
                ...state,
                deletingState: LoadingState.error
            };
        case DeleteDeviceSuccessActionName:
            return {
                ...state,
                deletingState: LoadingState.success
            };
    }
    return state;
};