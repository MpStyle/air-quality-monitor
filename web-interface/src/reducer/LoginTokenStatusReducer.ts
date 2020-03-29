import { Action } from "redux";
import { FetchLoginTokenSuccessAction, FetchLoginTokenSuccessActionName } from "../action/FetchLoginTokenAction";
import { LoginErrorActionName, LoginStartActionName } from "../action/LoginAction";
import { SessionStorageKey } from "../book/SessionStorageKey";
import { sessionStorageManager } from "../book/SessionStorageManager";
import { LoadingState } from "../entity/LoadingState";
import { LoginTokenStatus } from "../entity/LoginTokenStatus";
import { initialAppState } from "../store/InitialAppState";

export const loginTokenStatusReducer = (state: LoginTokenStatus = initialAppState.loginTokenStatus, action: Action): LoginTokenStatus => {
    switch (action.type) {
        case LoginStartActionName:
            return {
                ...state,
                loadingState: LoadingState.loading
            };
        case LoginErrorActionName:
            return {
                ...state,
                loadingState: LoadingState.error
            };
        case FetchLoginTokenSuccessActionName:
            const updateTokenAction = action as FetchLoginTokenSuccessAction;
            sessionStorageManager.setItem(SessionStorageKey.TOKEN_KEY, updateTokenAction.token);
            return {
                ...state,
                loginToken: updateTokenAction.token,
                loadingState: LoadingState.success
            };
    }

    return state;
};