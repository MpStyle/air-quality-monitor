import { Action } from "redux";
import { TimeRangeReading } from "../entity/TimeRangeReading";

// --- Start

export const FetchTimeRangeStartActionName = 'FetchTimeRangeStartAction';

export interface FetchTimeRangeStartAction extends Action {
}

export const fetchTimeRangeStartActionBuilder = (): FetchTimeRangeStartAction => {
    return {
        type: FetchTimeRangeStartActionName
    };
};

// --- Success

export const FetchTimeRangeSuccessActionName = 'FetchTimeRangeSuccessAction';

export interface FetchTimeRangeSuccessAction extends Action {
    yearlyAverages: TimeRangeReading[];
    monthlyAverages: TimeRangeReading[];
    dailyAverages: TimeRangeReading[];
}

export const fetchTimeRangeSuccessActionBuilder = (yearlyAverages: TimeRangeReading[], monthlyAverages: TimeRangeReading[], dailyAverages: TimeRangeReading[]): FetchTimeRangeSuccessAction => {
    return {
        type: FetchTimeRangeSuccessActionName,
        yearlyAverages,
        monthlyAverages,
        dailyAverages
    };
};

// --- Error

export const FetchTimeRangeErrorActionName = 'FetchTimeRangeErrorAction';

export interface FetchTimeRangeErrorAction extends Action {
    error: number;
}

export const fetchTimeRangeErrorActionBuilder = (error: number): FetchTimeRangeErrorAction => {
    return {
        type: FetchTimeRangeErrorActionName,
        error
    };
};