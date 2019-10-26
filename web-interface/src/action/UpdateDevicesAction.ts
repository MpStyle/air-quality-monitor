import { Action } from 'redux';
import { Device } from '../entity/Device';

export const UpdateDevicesActionName = 'UpdateDevicesAction';

export interface UpdateDevicesAction extends Action {
    devices: Device[];
}

export const updateDevicesActionBuilder = (devices: Device[]): UpdateDevicesAction => {
    return {
        type: UpdateDevicesActionName,
        devices: devices
    };
};