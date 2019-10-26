import { Action } from "redux";
import { UpdateDevicesAction, UpdateDevicesActionName } from "../action/UpdateDevicesAction";
import { Device } from "../entity/Device";
import { initialAppState } from "../store/InitialAppState";

export const devicesReducer = (state: Device[] = initialAppState.devices, action: Action): Device[] => {
    switch (action.type) {
        case UpdateDevicesActionName:
            const updateDevicesAction = action as UpdateDevicesAction;
            return updateDevicesAction.devices;
    }
    return state;
};