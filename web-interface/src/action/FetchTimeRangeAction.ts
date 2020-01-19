import { Action } from "redux";
import { TimeRangeReading } from "../entity/TimeRangeReading";

// --- FetchTimeRangeStartAction

export const FetchTimeRangeStartActionName = 'FetchTimeRangeStartAction';

export interface FetchTimeRangeStartAction extends Action {
}

export const fetchTimeRangeStartActionBuilder = (): FetchTimeRangeStartAction => {
    return {
        type: FetchTimeRangeStartActionName
    };
};

// --- FetchTimeRangeSuccessAction

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

// --- FetchTimeRangeEndAction

export const FetchTimeRangeErrorActionName = 'FetchTimeRangeErrorAction';

export interface FetchTimeRangeErrorAction extends Action {
}

export const fetchTimeRangeErrorActionBuilder = (): FetchTimeRangeErrorAction => {
    return {
        type: FetchTimeRangeErrorActionName
    };
};