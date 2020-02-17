import { Action } from 'redux';
import { AirStatus } from '../entity/AirStatus';

export const UpdateAirStatusActionName = 'UpdateAirStatusAction';

export interface UpdateAirStatusAction extends Action {
    airStatus: AirStatus;
}

export const updateAirStatusActionBuilder = (airStatus: AirStatus): UpdateAirStatusAction => {
    return {
        type: UpdateAirStatusActionName,
        airStatus
    };
};