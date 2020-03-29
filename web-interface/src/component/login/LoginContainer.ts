import { connect } from "react-redux";
import { RouteChildrenProps } from "react-router";
import { Action, Dispatch } from "redux";
import { fetchLoginTokenSuccessActionBuilder } from "../../action/FetchLoginTokenAction";
import { loginErrorActionBuilder, loginStartActionBuilder } from "../../action/LoginAction";
import { Pages } from "../../book/Pages";
import { userLogin } from "../../book/UserLogin";
import { AppState } from '../../entity/AppState';
import { Login, LoginProps } from "./Login";

export const LoginContainer = connect(
    (appState: AppState): LoginProps => {
        return {
            fallbackUrl: Pages.DASHBOARD_URL,
            token: appState.loginTokenStatus.loginToken,
            loginStatus: appState.loginTokenStatus.loadingState
        } as LoginProps;
    },
    (dispatch: Dispatch<Action>): LoginProps => {
        return {
            onSignInClick: (username: string, password: string) => {
                dispatch(loginStartActionBuilder());
                userLogin(username, password)
                    .then(response => {
                        if (response.error) {
                            dispatch(loginErrorActionBuilder(response.error));
                            console.error(response.error);
                            return;
                        }

                        if (response.payload) {
                            dispatch(fetchLoginTokenSuccessActionBuilder({
                                accessToken: response.payload.accessToken,
                                expiredAt: response.payload.expiredAt,
                                refreshToken: response.payload.refreshToken,
                                username: username
                            }));
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        dispatch(loginErrorActionBuilder(err));
                    });
            }
        } as LoginProps;
    }
)(Login);

export interface LoginContainerProps extends RouteChildrenProps { }