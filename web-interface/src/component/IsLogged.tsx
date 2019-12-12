import React, { useEffect, useState, Fragment, FunctionComponent } from 'react';
import { Redirect } from "react-router-dom";
import { appStore } from '../store/AppStore';

export const IsLogged: FunctionComponent<IsLoggedProps> = (props: IsLoggedProps) => {

    const [authenticationResult, setAuthenticationResult] = useState<boolean | null>(null);
    console.log("IsLogged", props, appStore.getState().secretKey, authenticationResult);

    useEffect(() => {
        if (appStore.getState().secretKey && authenticationResult == null) {
            props.authentication(appStore.getState().secretKey as string).then(u => setAuthenticationResult(u));
        }
    }, []);

    if (!appStore.getState().secretKey) {
        console.log(1);
        return <Redirect to={{ pathname: `${props.loginPageUrl}?sourceUrl=${props.sourceUrl}` }} />;
    }

    if (authenticationResult == null) {
        console.log(2);
        return <span>Authenticating...</span>;
    }

    if (authenticationResult) {
        console.log(3);
        return <Fragment>{props.children}</Fragment>;
    }

    console.log(4);
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