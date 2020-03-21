import { Action } from "redux";
import { FetchLoginTokenSuccessAction, FetchLoginTokenSuccessActionName } from "../action/FetchLoginTokenAction";
import { SessionStorageKey } from "../book/SessionStorageKey";
import { sessionStorageManager } from "../book/SessionStorageManager";
import { LoadingState } from "../entity/LoadingState";
import { LoginTokenStatus } from "../entity/LoginTokenStatus";
import { initialAppState } from "../store/InitialAppState";

export const loginTokenStatusResucer = (state: LoginTokenStatus = initialAppState.loginTokenStatus, action: Action): LoginTokenStatus => {
    switch (action.type) {
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