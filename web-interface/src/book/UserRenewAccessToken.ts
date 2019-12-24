import { ServiceResponse } from "../entity/ServiceResponse";

export const userRenewAccessToken = (refreshToken: string): Promise<ServiceResponse<UserNewAccessTokenResponse>> => {
    const url = process.env.REACT_APP_AIR_QUALITY_DATA_REMOTE_URL as string;
    return fetch(`${url}/app/user-renew-access-token`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken: refreshToken } as UserNewAccessTokenRequest)
    }).then((response): Promise<ServiceResponse<UserNewAccessTokenResponse>> => {
        return response.json();
    });
};

interface UserNewAccessTokenRequest {
    refreshToken: string;
}

export interface UserNewAccessTokenResponse {
    accessToken: string;
    expiresIn: number;
}