import { ServiceResponse } from "../entity/ServiceResponse";

const url = process.env.REACT_APP_AIR_QUALITY_DATA_REMOTE_URL as string;

let isRunning = false;
let promise: Promise<ServiceResponse<UserRenewAccessTokenResponse>>;

export const userRenewAccessToken = (refreshToken: string): Promise<ServiceResponse<UserRenewAccessTokenResponse>> => {
    if (isRunning && promise) {
        return promise;
    }

    isRunning = true;

    promise = fetch(`${url}/app/user-renew-access-token`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken: refreshToken } as UserRenewAccessTokenRequest)
    }).then((response): Promise<ServiceResponse<UserRenewAccessTokenResponse>> => {
        isRunning = false;
        return response.json();
    });

    return promise;
};

interface UserRenewAccessTokenRequest {
    refreshToken: string;
}

export interface UserRenewAccessTokenResponse {
    accessToken: string;
    expiredAt: number;
}