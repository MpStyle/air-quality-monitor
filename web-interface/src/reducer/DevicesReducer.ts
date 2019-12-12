import { Action } from "redux";
import { FetchDevicesSuccessAction, FetchDevicesSuccessActionName } from "../action/FetchDevicesSuccessAction";
import { Device } from "../entity/Device";
import { initialAppState } from "../store/InitialAppState";

export const devicesReducer = (state: Device[] = initialAppState.devices, action: Action): Device[] => {
    switch (action.type) {
        case FetchDevicesSuccessActionName:
            const updateDevicesAction = action as FetchDevicesSuccessAction;
            return updateDevicesAction.devices;
    }
    return state;
};