import { Action } from 'redux';

export const LoginErrorActionName = 'LoginErrorAction';

export interface LoginErrorAction extends Action {
}

export const loginErrorActionBuilder = (): LoginErrorAction => {
    return {
        type: LoginErrorActionName
    };
};