import { Button, TextField } from "@material-ui/core";
import React, { useState, FunctionComponent } from 'react';
import { useLocation, Redirect, RouteChildrenProps } from 'react-router';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export const Login: FunctionComponent<LoginProps> = (props) => {
    console.log("Login", props);
    let query = useQuery();
    const [secretKey, setSecretKey] = useState<string | null>(props.secretKey);

    if (props.secretKey) {
        return <Redirect to={{ pathname: query.get("sourceUrl") || props.fallbackUrl }} />;
    }

    return <div>
        <div>
            <span>Sign in</span>
            <TextField
                id="outlined-password-input"
                label="Secret key"
                type="password"
                variant="outlined"
                value={secretKey || ""}
                onChange={event => setSecretKey(event.target.value as string)}
            />
            <Button variant="contained" color="primary" onClick={() => props.onSignInClick(secretKey)} >
                Sign in
            </Button>
        </div>
    </div>;
};

export interface LoginProps extends RouteChildrenProps {
    onSignInClick: (secretKey: string | null) => void;
    secretKey: string | null;
    fallbackUrl: string;
}