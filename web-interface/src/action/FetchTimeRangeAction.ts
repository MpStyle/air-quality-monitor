import { Action } from "redux";
import { TimeRangeMeasurement } from "../entity/TimeRangeMeasurement";

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
    yearlyAverages: TimeRangeMeasurement[];
    monthlyAverages: TimeRangeMeasurement[];
    dailyAverages: TimeRangeMeasurement[];
}

export const fetchTimeRangeSuccessActionBuilder = (yearlyAverages: TimeRangeMeasurement[], monthlyAverages: TimeRangeMeasurement[], dailyAverages: TimeRangeMeasurement[]): FetchTimeRangeSuccessAction => {
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