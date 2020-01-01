import { Action } from "redux";
import { LoginErrorActionName } from "../action/LoginErrorAction";
import { LoginInProgressActionName } from "../action/LoginInProgressAction";
import { UpdateTokenAction, UpdateTokenActionName } from "../action/UpdateTokenAction";
import { LoginStatus } from "../entity/LoginStatus";
import { initialAppState } from "../store/InitialAppState";

export const loginStatusReducer = (state: LoginStatus = initialAppState.loginStatus, action: Action): LoginStatus => {
    switch (action.type) {
        case LoginInProgressActionName: return LoginStatus.InProgress;
        case LoginErrorActionName: return LoginStatus.Error;
        case UpdateTokenActionName:
            const updateTokenAction = action as UpdateTokenAction;
            if (updateTokenAction.token) {
                return LoginStatus.Success;
            }
            return LoginStatus.None;
        default: return state;
    }
};