import { Action } from "redux";
import { UpdateCurrentDeviceIdAction, UpdateCurrentDeviceIdActionName } from "../action/UpdateCurrentDeviceIdAction";
import { UpdateDevicesAction, UpdateDevicesActionName } from "../action/UpdateDevicesAction";
import { initialAppState } from "../store/InitialAppState";

export const currentDeviceReducer = (state: string | null = initialAppState.currentDevice, action: Action): string | null => {
    switch (action.type) {
        case UpdateDevicesActionName:
            const updateDevicesAction = action as UpdateDevicesAction;
            if (updateDevicesAction.devices && updateDevicesAction.devices.length) {
                return updateDevicesAction.devices[0].id;
            }
            break;
        case UpdateCurrentDeviceIdActionName:
            const updateCurrentDeviceAction = action as UpdateCurrentDeviceIdAction;
            return updateCurrentDeviceAction.currentDeviceId;
    }
    return state;
};