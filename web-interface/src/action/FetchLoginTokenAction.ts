import { Action } from 'redux';
import { LoginToken } from '../entity/LoginToken';

// --- Start

export const FetchLoginTokenStartActionName = 'FetchLoginTokenStartAction';

export interface FetchLoginTokenStartAction extends Action {
}

export const fetchLoginTokenStartActionBuilder = (): FetchLoginTokenStartAction => {
    return {
        type: FetchLoginTokenStartActionName
    };
};

// --- Success

export const FetchLoginTokenSuccessActionName = 'FetchLoginTokenSuccessAction';

export interface FetchLoginTokenSuccessAction extends Action {
    token: LoginToken | null;
}

export const fetchLoginTokenSuccessActionBuilder = (token: LoginToken | null): FetchLoginTokenSuccessAction => {
    return {
        type: FetchLoginTokenSuccessActionName,
        token
    };
};

// --- Error

export const FetchLoginTokenErrorActionName = 'FetchLoginTokenErrorAction';

export interface FetchLoginTokenErrorAction extends Action {
    error: string | number;
}

export const fetchLoginTokenErrorActionBuilder = (error: string | number): FetchLoginTokenErrorAction => {
    return {
        type: FetchLoginTokenSuccessActionName,
        error
    };
};