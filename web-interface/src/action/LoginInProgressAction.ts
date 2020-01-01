import { Action } from 'redux';

export const LoginInProgressActionName = 'LoginInProgressAction';

export interface LoginInProgressAction extends Action {
}

export const loginInProgressActionBuilder = (): LoginInProgressAction => {
    return {
        type: LoginInProgressActionName
    };
};