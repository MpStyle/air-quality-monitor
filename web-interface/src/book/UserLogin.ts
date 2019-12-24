import { ServiceResponse } from "../entity/ServiceResponse";

export const userLogin = (username: string, password: string): Promise<ServiceResponse<UserLoginResponse>> => {
    const url = process.env.REACT_APP_AIR_QUALITY_DATA_REMOTE_URL as string;
    return fetch(`${url}/app/user-login`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password } as UserLoginRequest)
    }).then((response): Promise<ServiceResponse<UserLoginResponse>> => {
        return response.json();
    });
};

export interface UserLoginRequest {
    username: string;
    password: string;
}

export interface UserLoginResponse {
    accessToken: string;
    expiredAt: number;
    refreshToken: string;
}