import { Action } from 'redux';
import { AirQualityData } from '../entity/AirQualityData';

export const FetchAirQualityDataSuccessActionName = 'FetchAirQualityDataSuccessAction';

export interface FetchAirQualityDataSuccessAction extends Action {
    data: AirQualityData;
}

export const fetchAirQualityDataSuccessActionBuilder = (data: AirQualityData): FetchAirQualityDataSuccessAction => {
    return {
        type: FetchAirQualityDataSuccessActionName,
        data: data
    };
};