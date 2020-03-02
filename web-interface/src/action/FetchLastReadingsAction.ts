import { Action } from 'redux';
import { UserMeasurementsSearchResponse } from '../book/UserLastReadings';

// --- Start

export const FetchLastReadingsName = 'FetchLastReadings';

export interface FetchLastReadingsStartAction extends Action {
}

export const fetchLastReadingsStartActionBuilder = (): FetchLastReadingsStartAction => {
    return {
        type: FetchLastReadingsName,
    };
};

// --- Success

export const FetchLastReadingsSuccessActionName = 'FetchLastReadingsSuccessAction';

export interface FetchLastReadingsSuccessAction extends Action {
    lastReadings?: UserMeasurementsSearchResponse;
}

export const fetchLastReadingsSuccessActionBuilder = (lastReadings?: UserMeasurementsSearchResponse): FetchLastReadingsSuccessAction => {
    return {
        type: FetchLastReadingsSuccessActionName,
        lastReadings
    };
};

// --- Error

export const FetchLastReadingsErrorActionName = 'FetchLastReadingsErrorAction';

export interface FetchLastReadingsErrorAction extends Action {
    error: number;
}

export const fetchLastReadingsErrorActionBuilder = (error: number): FetchLastReadingsErrorAction => {
    return {
        type: FetchLastReadingsErrorActionName,
        error
    };
};