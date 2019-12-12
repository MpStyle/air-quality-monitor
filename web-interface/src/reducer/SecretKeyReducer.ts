import { Action } from "redux";
import { initialAppState } from "../store/InitialAppState";
import { UpdateSecretKeyAction, UpdateSecretKeyActionName } from './../action/UpdateSecretKeyAction';
import { SECRET_KEY_KEY } from './../book/SessionStorageKeys';

export const secretKeyReducer = (state: string | null = initialAppState.secretKey, action: Action) => {
    switch (action.type) {
        case UpdateSecretKeyActionName:
            const secretKey = (action as UpdateSecretKeyAction).secretKey;
            if (secretKey == null) {
                sessionStorage.clear();
            }
            else {
                sessionStorage.setItem(SECRET_KEY_KEY, secretKey);
            }
            return secretKey;
    }

    return state;
};