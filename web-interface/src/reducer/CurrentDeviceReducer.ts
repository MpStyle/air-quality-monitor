import { Action } from "redux";
import { FetchDevicesSuccessAction, FetchDevicesSuccessActionName } from "../action/FetchDevicesSuccessAction";
import { UpdateCurrentDeviceIdAction, UpdateCurrentDeviceIdActionName } from "../action/UpdateCurrentDeviceIdAction";
import { AIR_QUALITY_DATA_CURRENT_DEVICE_ID_KEY } from "../book/LocalStorageKeys";
import { initialAppState } from "../store/InitialAppState";

export const currentDeviceReducer = (state: string | null = initialAppState.currentDevice, action: Action): string | null => {
    switch (action.type) {
        case FetchDevicesSuccessActionName:
            const updateDevicesAction = action as FetchDevicesSuccessAction;
            if (updateDevicesAction.devices && updateDevicesAction.devices.length && !state) {
                localStorage.setItem(AIR_QUALITY_DATA_CURRENT_DEVICE_ID_KEY, updateDevicesAction.devices[0].deviceId);
                return updateDevicesAction.devices[0].deviceId;
            }
            break;
        case UpdateCurrentDeviceIdActionName:
            const updateCurrentDeviceAction = action as UpdateCurrentDeviceIdAction;
            localStorage.setItem(AIR_QUALITY_DATA_CURRENT_DEVICE_ID_KEY, updateCurrentDeviceAction.currentDeviceId);
            return updateCurrentDeviceAction.currentDeviceId;
    }
    return state;
};