import React, { createElement, FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, RouteProps } from "react-router-dom";
import { Pages } from '../../book/Pages';
import { AppState } from './../../entity/AppState';
import "./IsLogged.scss";

const IsLogged: FunctionComponent<IsLoggedProps & RouteProps> = props => {
    return <Route {...props} render={internalProps => (
        props.isAuthenticated ?
            createElement(props.component as FunctionComponent, internalProps as any) :
            <Redirect to={{ pathname: `${Pages.LOGIN_URL}`, search: `?sourceUrl=${internalProps.location.pathname}` }} />
    )} />;
};

export interface IsLoggedProps {
    isAuthenticated?: boolean;
}

export const RequiredAuthenticationRoute = connect(
    (appState: AppState): IsLoggedProps => {
        return {
            isAuthenticated: !!appState.token && appState.token.expiredAt < Date.now()
        } as IsLoggedProps;
    }
)(IsLogged);