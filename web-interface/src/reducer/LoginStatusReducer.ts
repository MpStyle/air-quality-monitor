import { Action } from "redux";
import { LoginErrorActionName } from "../action/LoginErrorAction";
import { LoginInProgressActionName } from "../action/LoginInProgressAction";
import { UpdateTokenAction, UpdateTokenActionName } from "../action/UpdateTokenAction";
import { LoadingState } from "../entity/LoadingState";
import { initialAppState } from "../store/InitialAppState";

export const loginStatusReducer = (state: LoadingState = initialAppState.loginStatus, action: Action): LoadingState => {
    switch (action.type) {
        case LoginInProgressActionName: return LoadingState.loading;
        case LoginErrorActionName: return LoadingState.error;
        case UpdateTokenActionName:
            const updateTokenAction = action as UpdateTokenAction;
            if (updateTokenAction.token) {
                return LoadingState.success;
            }
            return LoadingState.none;
        default: return state;
    }
};