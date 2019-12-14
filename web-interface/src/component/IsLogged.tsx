import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import Paper from '@material-ui/core/Paper/Paper';
import Typography from '@material-ui/core/Typography/Typography';
import React, { Fragment, FunctionComponent, useEffect, useState } from 'react';
import { Redirect } from "react-router-dom";
import logo from '../images/logo.svg';
import { appStore } from '../store/AppStore';
import "./IsLogged.scss";

export const IsLogged: FunctionComponent<IsLoggedProps> = (props: IsLoggedProps) => {

    const [authenticationResult, setAuthenticationResult] = useState<boolean | null>(null);

    useEffect(() => {
        if (appStore.getState().secretKey && authenticationResult == null) {
            props.authentication(appStore.getState().secretKey as string).then(u => setAuthenticationResult(u));
        }
    }, []);

    if (!appStore.getState().secretKey) {
        return <Redirect to={{ pathname: `${props.loginPageUrl}?sourceUrl=${props.sourceUrl}` }} />;
    }

    if (authenticationResult == null) {
        return <span className="authenticating-message">
            <Paper elevation={2} className="content">
                <Typography variant="h6">
                    <img src={logo} /> Air Quality Monitor
            </Typography>
                <div className="message">Authenticating...</div>
                <CircularProgress />
            </Paper>
        </span>;
    }

    if (authenticationResult) {
        return <Fragment>{props.children}</Fragment>;
    }

    props.resetSecretKey();
    // return <Redirect to={{ pathname: `${props.loginPageUrl}` }} />;
    return <Redirect to={`${props.loginPageUrl}?sourceUrl=${props.sourceUrl}`} push={true} />;
};

export interface IsLoggedProps {
    loginPageUrl: string;
    // secretKey: string | null;
    children: React.ReactNode;
    sourceUrl: string | null;
    authentication: (secretKey: string) => Promise<boolean | null>;
    resetSecretKey: () => void;
}