import React, { Fragment, FunctionComponent } from 'react';
import { Redirect } from "react-router-dom";
import { appStore } from '../../store/AppStore';
import "./IsLogged.scss";

export const IsLogged: FunctionComponent<IsLoggedProps> = (props: IsLoggedProps) => {
    if (!appStore.getState().token) {
        return <Redirect to={{ pathname: `${props.loginPageUrl}`, search: `?sourceUrl=${props.sourceUrl}` }} />;
    }

    return <Fragment>{props.children}</Fragment>;
};

export interface IsLoggedProps {
    loginPageUrl: string;
    children: React.ReactNode;
    sourceUrl: string | null;
}