import { Action } from "redux";
import { UpdateTokenAction, UpdateTokenActionName } from "../action/UpdateTokenAction";
import { TOKEN_KEY } from "../book/SessionStorageKeys";
import { LoginToken } from "../entity/LoginToken";
import { initialAppState } from "../store/InitialAppState";

export const tokenReducer = (state: LoginToken | null = initialAppState.token, action: Action) => {
    switch (action.type) {
        case UpdateTokenActionName:
            const updateTokenAction = action as UpdateTokenAction;
            sessionStorage.setItem(TOKEN_KEY, JSON.stringify(updateTokenAction.token));
            return updateTokenAction.token;
    }

    return state;
};