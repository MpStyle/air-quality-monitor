import { Button, Paper, TextField, Typography } from "@material-ui/core";
import React, { FunctionComponent, useState } from 'react';
import { Redirect, RouteChildrenProps, useLocation } from 'react-router';
import logo from '../images/logo.svg';
import "./Login.scss";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export const Login: FunctionComponent<LoginProps> = (props) => {
    let query = useQuery();
    const [secretKey, setSecretKey] = useState<string | null>(props.secretKey);

    if (props.secretKey) {
        return <Redirect to={{ pathname: query.get("sourceUrl") || props.fallbackUrl }} />;
    }

    return <div className="login">
        <Paper elevation={2} className="content">
            <Typography variant="h6">
                <img src={logo} /> Air Quality Monitor
                </Typography>
            <div className="title">Sign in</div>
            <TextField
                className="password"
                label="Secret key"
                type="password"
                variant="outlined"
                value={secretKey || ""}
                onChange={event => setSecretKey(event.target.value as string)}
            />
            <div className="sign-in-button-container">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => props.onSignInClick(secretKey)}
                    className="sign-in-button">
                    Sign in
                </Button>
            </div>
        </Paper>
    </div>;
};

export interface LoginProps extends RouteChildrenProps {
    onSignInClick: (secretKey: string | null) => void;
    secretKey: string | null;
    fallbackUrl: string;
}