import { Action } from 'redux';
import { AirQualityData } from './../entity/AirQualityData';

export const UpdateAirQualityDataActionName = 'UpdateAirQualityDataAction';

export interface UpdateAirQualityDataAction extends Action {
    data: AirQualityData;
}

export const updateAirQualityDataActionBuilder = (data: AirQualityData): UpdateAirQualityDataAction => {
    return {
        type: UpdateAirQualityDataActionName,
        data: data
    };
};