import { Button, Paper, TextField, Typography } from "@material-ui/core";
import React, { FunctionComponent, useState } from 'react';
import { RouteChildrenProps, useLocation } from 'react-router';
import { Redirect } from "react-router-dom";
import { LoginToken } from "../entity/LoginToken";
import logo from '../images/logo.svg';
import "./Login.scss";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export const Login: FunctionComponent<LoginProps> = (props) => {
    let query = useQuery();
    const [password, setPassword] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    if (props.token) {
        return <Redirect to={{ pathname: query.get("sourceUrl") || props.fallbackUrl }} />;
    }

    return <div className="login">
        <Paper elevation={2} className="content">
            <Typography variant="h6">
                <img src={logo} alt="Air Quality Monitor logo" /> Air Quality Monitor
                </Typography>
            <Typography variant="h6" className="subtitle1">
                Sign in
            </Typography>
            <TextField
                className="username"
                label="Username"
                type="text"
                variant="outlined"
                onChange={event => setUsername(event.target.value as string)}
            />
            <TextField
                className="password"
                label="Password"
                type="password"
                variant="outlined"
                value={password || ""}
                onChange={event => setPassword(event.target.value as string)}
            />
            <div className="sign-in-button-container">
                <Button
                    variant="contained"
                    color="primary"
                    disabled={!username || !password}
                    onClick={() => props.onSignInClick(username, password)}
                    className="sign-in-button">
                    Sign in
                </Button>
            </div>
        </Paper>
    </div>;
};

export interface LoginProps extends RouteChildrenProps {
    onSignInClick: (username: string | null, password: string | null) => void;
    fallbackUrl: string;
    token: LoginToken | null;
}