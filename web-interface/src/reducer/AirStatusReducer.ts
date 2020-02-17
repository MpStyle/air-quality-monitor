import { Action } from "redux";
import { UpdateAirStatusAction, UpdateAirStatusActionName } from "../action/UpdateAirStatusAction";
import { AirStatus } from "../entity/AirStatus";
import { initialAppState } from "../store/InitialAppState";

export const airStatusReducer = (state: AirStatus = initialAppState.airStatus, action: Action): AirStatus => {
    switch (action.type) {
        case UpdateAirStatusActionName:
            const updateAirStatusAction = action as UpdateAirStatusAction;

            return updateAirStatusAction.airStatus;
    }
    return state;
};