import { connect } from "react-redux";
import { RouteChildrenProps } from "react-router";
import { Action, Dispatch } from "redux";
import { updateSecretKeyActionBuilder } from "../action/UpdateSecretKeyAction";
import { DASHBOARD_URL } from "../book/Pages";
import { AppState } from './../entity/AppState';
import { Login, LoginProps } from "./Login";

export const LoginContainer = connect(
    (appState: AppState): LoginProps => {
        return {
            fallbackUrl: DASHBOARD_URL,
            secretKey: appState.secretKey
        } as LoginProps;
    },
    (dispatch: Dispatch<Action>): LoginProps => {
        return {
            onSignInClick: (secretKey: string | null) => {
                dispatch(updateSecretKeyActionBuilder(secretKey));
            }
        } as LoginProps;
    }
)(Login);

export interface LoginContainerProps extends RouteChildrenProps { }