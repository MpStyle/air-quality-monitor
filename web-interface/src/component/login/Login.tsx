import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import Paper from '@material-ui/core/Paper/Paper';
import TextField from '@material-ui/core/TextField/TextField';
import Typography from '@material-ui/core/Typography/Typography';
import React, { FunctionComponent, useState } from 'react';
import { RouteChildrenProps, useLocation } from 'react-router';
import { Link, Redirect } from "react-router-dom";
import { LoadingState } from "../../entity/LoadingState";
import { LoginToken } from "../../entity/LoginToken";
import logo from '../../images/logo.svg';
import { AppButton } from "../common/AppButton";
import "./Login.scss";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export const Login: FunctionComponent<LoginProps> = (props) => {
    const query = useQuery();
    const [password, setPassword] = useState<string | null | undefined>(process.env.REACT_APP_AIR_QUALITY_DATA_password);
    const [username, setUsername] = useState<string | null | undefined>(process.env.REACT_APP_AIR_QUALITY_DATA_USERNAME);
    const isLoginButtonDisabled = !username || !password;
    const loginButtonTooltip = isLoginButtonDisabled ? 'Insert username and password' : undefined;

    if (props.token && props.token.expiredAt > Date.now()) {
        return <Redirect to={{ pathname: query.get("sourceUrl") || props.fallbackUrl }} />;
    }

    return <div className="login">
        <Paper elevation={2} className="content">
            <Typography variant="h6">
                <img src={logo} alt="Air Quality Monitor logo" /> Air Quality Monitor
            </Typography>

            {props.loginStatus === LoadingState.loading && <div className="login-in-progress">
                <CircularProgress />
                <Typography variant="body1" className="message" color="textSecondary">
                    Login in progress
                </Typography>
            </div>}

            {props.loginStatus !== LoadingState.loading && <React.Fragment>
                <Typography variant="h6" className="subtitle1">
                    Sign in
                </Typography>
                <TextField
                    className="username"
                    label="Username"
                    type="text"
                    variant="outlined"
                    value={username || ""}
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
                {props.loginStatus === LoadingState.error && <Typography variant="body1" className="login-error" color="error">
                    Error during login. Check the credentials and try again
                </Typography>}
                <div className="sign-in-button-container">
                    <AppButton
                        onClick={() => props.onSignInClick(username, password)}
                        className="sign-in-button"
                        title={loginButtonTooltip}
                        disabled={isLoginButtonDisabled}>
                        Sign in
                    </AppButton>
                </div>

                <Link to="/credits" className="credits-link">Credits</Link>

            </React.Fragment>}

        </Paper>
    </div>;
};

export interface LoginProps extends RouteChildrenProps {
    onSignInClick: (username: string | null | undefined, password: string | null | undefined) => void;
    fallbackUrl: string;
    token: LoginToken | null;
    loginStatus: LoadingState;
}