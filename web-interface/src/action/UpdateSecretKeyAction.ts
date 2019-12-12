import { Action } from 'redux';

export const UpdateSecretKeyActionName = 'UpdateSecretKeyAction';

export interface UpdateSecretKeyAction extends Action {
    secretKey: string | null;
}

export const updateSecretKeyActionBuilder = (secretKey: string | null): UpdateSecretKeyAction => {
    return {
        type: UpdateSecretKeyActionName,
        secretKey
    };
};