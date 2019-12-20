import { Action } from "redux";
import { FetchDevicesSuccessAction, FetchDevicesSuccessActionName } from "../action/FetchDevicesSuccessAction";
import { UpdateCurrentDeviceIdAction, UpdateCurrentDeviceIdActionName } from "../action/UpdateCurrentDeviceIdAction";
import { initialAppState } from "../store/InitialAppState";

export const currentDeviceReducer = (state: string | null = initialAppState.currentDevice, action: Action): string | null => {
    switch (action.type) {
        case FetchDevicesSuccessActionName:
            const updateDevicesAction = action as FetchDevicesSuccessAction;
            if (updateDevicesAction.devices && updateDevicesAction.devices.length) {
                return updateDevicesAction.devices[0].deviceId;
            }
            break;
        case UpdateCurrentDeviceIdActionName:
            const updateCurrentDeviceAction = action as UpdateCurrentDeviceIdAction;
            return updateCurrentDeviceAction.currentDeviceId;
    }
    return state;
};