import { Action } from "redux";
import { UpdateAirStatusAverageAction, UpdateAirStatusAverageActionName } from "../action/UpdateAirStatusAverageAction";
import { AirQuality } from "../entity/AirStatus";
import { initialAppState } from "../store/InitialAppState";

export const airStatusAverageReducer = (state: AirQuality = initialAppState.airStatusAverage, action: Action): AirQuality => {
    switch (action.type) {
        case UpdateAirStatusAverageActionName:
            const updateAirStatusAverageAction = action as UpdateAirStatusAverageAction;

            return updateAirStatusAverageAction.airStatusAverage;
    }
    return state;
};