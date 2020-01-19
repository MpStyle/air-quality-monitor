import { Action } from 'redux';
import { Device } from '../entity/Device';

// Start

export const FetchDevicesStartActionName = 'FetchDevicesStartAction';

export interface FetchDevicesStartAction extends Action {
}

export const fetchDevicesStartActionBuilder = (): FetchDevicesStartAction => {
    return {
        type: FetchDevicesStartActionName
    };
};

// Success

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

// Error

export const FetchDevicesErrorActionName = 'FetchDevicesErrorAction';

export interface FetchDevicesErrorAction extends Action {
    error: number;
}

export const fetchDevicesErrorActionBuilder = (error: number): FetchDevicesErrorAction => {
    return {
        type: FetchDevicesErrorActionName,
        error
    };
};