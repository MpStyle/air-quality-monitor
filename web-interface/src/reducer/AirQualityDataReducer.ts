import { Action } from "redux";
import { AirQualityData } from "../entity/AirQualityData";
import { initialAppState } from "../store/InitialAppState";
import { UpdateAirQualityDataAction, UpdateAirQualityDataActionName } from './../action/UpdateAirQualityDataAction';

export const airQualityDataReducer = (state: AirQualityData = initialAppState.airQualityData, action: Action): AirQualityData => {
    switch (action.type) {
        case UpdateAirQualityDataActionName:
            const updateAirQualityDataAction = action as UpdateAirQualityDataAction;
            return updateAirQualityDataAction.data;
    }
    return state;
};