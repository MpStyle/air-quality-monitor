import { Action } from 'redux';
import { AirQuality } from '../entity/AirStatus';

export const UpdateAirStatusAverageActionName = 'UpdateAirStatusAverageAction';

export interface UpdateAirStatusAverageAction extends Action {
    airStatusAverage: AirQuality;
}

export const updateAirStatusAverageActionBuilder = (airStatusAverage: AirQuality): UpdateAirStatusAverageAction => {
    return {
        type: UpdateAirStatusAverageActionName,
        airStatusAverage
    };
};