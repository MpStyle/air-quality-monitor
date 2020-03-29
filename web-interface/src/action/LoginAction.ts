import { Action } from 'redux';

// Start

export const LoginStartActionName = 'LoginStartAction';

export interface LoginStartAction extends Action {
}

export const loginStartActionBuilder = (): LoginStartAction => {
    return {
        type: LoginStartActionName
    };
};

// Error

export const LoginErrorActionName = 'LoginErrorAction';

export interface LoginErrorAction extends Action {
    error: number | string;
}

export const loginErrorActionBuilder = (error: number | string): LoginErrorAction => {
    return {
        type: LoginErrorActionName,
        error
    };
};