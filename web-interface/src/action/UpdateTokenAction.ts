import { Action } from 'redux';
import { LoginToken } from '../entity/LoginToken';

export const UpdateTokenActionName = 'UpdateTokenAction';

export interface UpdateTokenAction extends Action {
    token: LoginToken | null;
}

export const updateTokenActionBuilder = (token: LoginToken | null): UpdateTokenAction => {
    return {
        type: UpdateTokenActionName,
        token
    };
};