import { connect } from "react-redux";
import { RouteChildrenProps } from "react-router";
import { Action, Dispatch } from "redux";
import { updateTokenActionBuilder } from "../action/UpdateTokenAction";
import { DASHBOARD_URL } from "../book/Pages";
import { userLogin } from "../book/UserLogin";
import { AppState } from './../entity/AppState';
import { Login, LoginProps } from "./Login";

export const LoginContainer = connect(
    (appState: AppState): LoginProps => {
        return {
            fallbackUrl: DASHBOARD_URL,
            token: appState.token
        } as LoginProps;
    },
    (dispatch: Dispatch<Action>): LoginProps => {
        return {
            onSignInClick: (username: string, password: string) => {
                userLogin(username, password)
                    .then(response => {
                        if (response.error) {
                            console.error(response.error);
                            return;
                        }

                        if (response.payload) {
                            dispatch(updateTokenActionBuilder({
                                accessToken: response.payload.accessToken,
                                expiredAt: response.payload.expiredAt,
                                refreshToken: response.payload.refreshToken,
                                username: username
                            }));
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    });
            }
        } as LoginProps;
    }
)(Login);

export interface LoginContainerProps extends RouteChildrenProps { }