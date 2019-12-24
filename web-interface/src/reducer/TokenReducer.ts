import { Action } from "redux";
import { UpdateTokenAction, UpdateTokenActionName } from "../action/UpdateTokenAction";
import { LoginToken } from "../entity/LoginToken";
import { initialAppState } from "../store/InitialAppState";

export const tokenReducer = (state: LoginToken | null = initialAppState.token, action: Action) => {
    switch (action.type) {
        case UpdateTokenActionName:
            return (action as UpdateTokenAction).token;
    }

    return state;
};