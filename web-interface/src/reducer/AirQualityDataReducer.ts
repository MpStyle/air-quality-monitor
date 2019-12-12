import { Action } from "redux";
import { FetchAirQualityDataSuccessAction, FetchAirQualityDataSuccessActionName } from '../action/FetchAirQualityDataSuccessAction';
import { AirQualityData } from "../entity/AirQualityData";
import { initialAppState } from "../store/InitialAppState";

export const airQualityDataReducer = (state: AirQualityData = initialAppState.airQualityData, action: Action): AirQualityData => {
    switch (action.type) {
        case FetchAirQualityDataSuccessActionName:
            const updateAirQualityDataAction = action as FetchAirQualityDataSuccessAction;
            return updateAirQualityDataAction.data;
    }
    return state;
};