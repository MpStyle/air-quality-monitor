import { ServiceResponse } from "../entity/ServiceResponse";

export const userRevokeRefreshToken = (refreshToken: string): Promise<ServiceResponse<{}>> => {
    const url = process.env.REACT_APP_AIR_QUALITY_DATA_REMOTE_URL as string;
    return fetch(`${url}/app/user-revoke-refresh-token`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken: refreshToken } as UserRevokeRefreshTokenRequest)
    }).then((response): Promise<ServiceResponse<{}>> => {
        return response.json();
    });
};

export interface UserRevokeRefreshTokenRequest {
    refreshToken: string;
}