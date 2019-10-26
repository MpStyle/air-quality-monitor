import { Action } from "redux";
import { UpdateCurrentDeviceIdAction, UpdateCurrentDeviceIdActionName } from "../action/UpdateCurrentDeviceIdAction";
import { initialAppState } from "../store/InitialAppState";

export const currentDeviceReducer = (state: string | null = initialAppState.currentDevice, action: Action): string | null => {
    switch (action.type) {
        case UpdateCurrentDeviceIdActionName:
            const updateCurrentDeviceAction = action as UpdateCurrentDeviceIdAction;
            return updateCurrentDeviceAction.currentDeviceId;
    }
    return state;
};