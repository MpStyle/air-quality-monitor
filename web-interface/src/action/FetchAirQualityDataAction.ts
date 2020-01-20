import { Action } from 'redux';
import { AirQualityData } from '../entity/AirQualityData';

// --- Start

export const FetchAirQualityDataStartActionName = 'FetchAirQualityDataStartAction';

export interface FetchAirQualityDataStartAction extends Action {
}

export const fetchAirQualityDataStartActionBuilder = (): FetchAirQualityDataStartAction => {
    return {
        type: FetchAirQualityDataStartActionName,
    };
};

// --- Success

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

// --- Error

export const FetchAirQualityDataErrorActionName = 'FetchAirQualityDataErrorAction';

export interface FetchAirQualityDataErrorAction extends Action {
    error: number;
}

export const fetchAirQualityDataErrorActionBuilder = (error: number): FetchAirQualityDataErrorAction => {
    return {
        type: FetchAirQualityDataErrorActionName,
        error
    };
};