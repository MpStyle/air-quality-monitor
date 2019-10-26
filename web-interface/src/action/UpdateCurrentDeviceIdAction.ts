import { Action } from 'redux';

export const UpdateCurrentDeviceIdActionName = 'UpdateCurrentDeviceIdAction';

export interface UpdateCurrentDeviceIdAction extends Action {
    currentDeviceId: string;
}

export const updateCurrentDeviceIdActionBuilder = (currentDeviceId: string): UpdateCurrentDeviceIdAction => {
    return {
        type: UpdateCurrentDeviceIdActionName,
        currentDeviceId: currentDeviceId
    };
};