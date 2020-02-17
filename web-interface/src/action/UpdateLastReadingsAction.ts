import { Action } from 'redux';
import { AirQualityData } from '../entity/AirQualityData';

export const UpdateLastReadingsActionName = 'UpdateLastReadingsAction';

export interface UpdateLastReadingsAction extends Action {
    data: AirQualityData;
}

export const updateLastReadingsActionBuilder = (data: AirQualityData): UpdateLastReadingsAction => {
    return {
        type: UpdateLastReadingsActionName,
        data
    };
};