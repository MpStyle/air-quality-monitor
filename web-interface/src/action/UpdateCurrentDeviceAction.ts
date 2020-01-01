import { Action } from 'redux';
import { Device } from '../entity/Device';

export const UpdateCurrentDeviceActionName = 'UpdateCurrentDeviceAction';

export interface UpdateCurrentDeviceAction extends Action {
    currentDevice: Device;
}

export const updateCurrentDeviceActionBuilder = (currentDevice: Device): UpdateCurrentDeviceAction => {
    return {
        type: UpdateCurrentDeviceActionName,
        currentDevice: currentDevice
    };
};