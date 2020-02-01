import { Action } from "redux";
import { FetchDevicesSuccessAction, FetchDevicesSuccessActionName } from "../action/FetchDevicesAction";
import { UpdateCurrentDeviceAction, UpdateCurrentDeviceActionName } from "../action/UpdateCurrentDeviceAction";
import { AIR_QUALITY_DATA_CURRENT_DEVICE_KEY } from "../book/LocalStorageKeys";
import { Device } from "../entity/Device";
import { initialAppState } from "../store/InitialAppState";

export const currentDeviceReducer = (state: Device | null = initialAppState.currentDevice, action: Action): Device | null => {
    switch (action.type) {
        case FetchDevicesSuccessActionName:
            const updateDevicesAction = action as FetchDevicesSuccessAction;
            if (updateDevicesAction.devices && updateDevicesAction.devices.length && !state) {
                localStorage.setItem(AIR_QUALITY_DATA_CURRENT_DEVICE_KEY, JSON.stringify(updateDevicesAction.devices[0]));
                return updateDevicesAction.devices[0];
            }

            if (!updateDevicesAction.devices || !updateDevicesAction.devices.length) {
                localStorage.removeItem(AIR_QUALITY_DATA_CURRENT_DEVICE_KEY);
                return null;
            }
            break;
        case UpdateCurrentDeviceActionName:
            const updateCurrentDeviceAction = action as UpdateCurrentDeviceAction;
            localStorage.setItem(AIR_QUALITY_DATA_CURRENT_DEVICE_KEY, JSON.stringify(updateCurrentDeviceAction.currentDevice));
            return updateCurrentDeviceAction.currentDevice;
    }
    return state;
};