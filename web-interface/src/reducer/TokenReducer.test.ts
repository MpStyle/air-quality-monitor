import { UpdateTokenAction } from "../action/UpdateTokenAction";
import { SessionStorageKey } from "../book/SessionStorageKey";
import { LoginToken } from "../entity/LoginToken";
import { UpdateTokenActionName } from './../action/UpdateTokenAction';
import { sessionStorageManager } from './../book/SessionStorageManager';
import { initialAppState } from './../store/InitialAppState';
import { tokenReducer } from "./TokenReducer";

it('TokenReducer', () => {
    const expiredAt = Date.now() + 5000;
    const accessToken = 'access-token';
    const refreshToken = 'refresh-token';
    const username = 'username';
    const state = tokenReducer(initialAppState.token, {
        token: {
            accessToken,
            expiredAt,
            refreshToken,
            username,
        },
        type: UpdateTokenActionName
    } as UpdateTokenAction);

    expect(state?.accessToken).toEqual(accessToken);
    expect(state?.expiredAt).toEqual(expiredAt);
    expect(state?.refreshToken).toEqual(refreshToken);
    expect(state?.username).toEqual(username);

    const localStorageState = sessionStorageManager.getItem<LoginToken>(SessionStorageKey.TOKEN_KEY);

    expect(localStorageState?.accessToken).toEqual(accessToken);
    expect(localStorageState?.expiredAt).toEqual(expiredAt);
    expect(localStorageState?.refreshToken).toEqual(refreshToken);
    expect(localStorageState?.username).toEqual(username);
});

it('TokenReducer - empty token', () => {
    const state = tokenReducer(initialAppState.token, {
        token: {},
        type: UpdateTokenActionName
    } as UpdateTokenAction);

    expect(state?.accessToken).toBeUndefined();
    expect(state?.expiredAt).toBeUndefined();
    expect(state?.refreshToken).toBeUndefined();
    expect(state?.username).toBeUndefined();

    const localStorageState = sessionStorageManager.getItem<LoginToken>(SessionStorageKey.TOKEN_KEY);

    expect(localStorageState?.accessToken).toBeUndefined();
    expect(localStorageState?.expiredAt).toBeUndefined();
    expect(localStorageState?.refreshToken).toBeUndefined();
    expect(localStorageState?.username).toBeUndefined();
});