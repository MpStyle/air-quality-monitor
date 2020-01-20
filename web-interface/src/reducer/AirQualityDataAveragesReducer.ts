import { Action } from "redux";
import { LoadingState } from "../entity/LoadingState";
import { initialAppState } from "../store/InitialAppState";
import { FetchTimeRangeErrorActionName, FetchTimeRangeStartActionName, FetchTimeRangeSuccessAction, FetchTimeRangeSuccessActionName } from './../action/FetchTimeRangeAction';
import { AirQualityDataAverages } from './../entity/AirQualityDataAverages';

export const airQualityDataAveragesReducer = (state: AirQualityDataAverages = initialAppState.airQualityDataAverages, action: Action) => {
    switch (action.type) {
        case FetchTimeRangeStartActionName:
            return {
                ...state,
                loadingState: LoadingState.loading
            } as AirQualityDataAverages;
        case FetchTimeRangeSuccessActionName:
            const success = action as FetchTimeRangeSuccessAction;
            return {
                ...state,
                loadingState: LoadingState.success,
                dailyAverages: success.dailyAverages,
                monthlyAverages: success.monthlyAverages,
                yearlyAverages: success.yearlyAverages
            } as AirQualityDataAverages;
        case FetchTimeRangeErrorActionName:
            return {
                ...state,
                loadingState: LoadingState.error
            } as AirQualityDataAverages;
    }

    return state;
};