import { Action } from 'redux';

// --- Start

export const DeleteDeviceStartActionName = 'DeleteDeviceStartAction';

export interface DeleteDeviceStartAction extends Action {
}

export const deleteDeviceStartActionBuilder = (): DeleteDeviceStartAction => {
    return {
        type: DeleteDeviceStartActionName,
    };
};

// --- Success

export const DeleteDeviceSuccessActionName = 'DeleteDeviceSuccessAction';

export interface DeleteDeviceSuccessAction extends Action {
}

export const deleteDeviceSuccessActionBuilder = (): DeleteDeviceSuccessAction => {
    return {
        type: DeleteDeviceSuccessActionName,
    };
};

// --- Error

export const DeleteDeviceErrorActionName = 'DeleteDeviceErrorAction';

export interface DeleteDeviceErrorAction extends Action {
    error: number;
}

export const deleteDeviceErrorActionBuilder = (error: number): DeleteDeviceErrorAction => {
    return {
        type: DeleteDeviceErrorActionName,
        error
    };
};