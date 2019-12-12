import { Action } from 'redux';
import { Device } from '../entity/Device';

export const FetchDevicesSuccessActionName = 'FetchDevicesSuccessAction';

export interface FetchDevicesSuccessAction extends Action {
    devices: Device[];
}

export const fetchDevicesSuccessActionBuilder = (devices: Device[]): FetchDevicesSuccessAction => {
    return {
        type: FetchDevicesSuccessActionName,
        devices: devices
    };
};