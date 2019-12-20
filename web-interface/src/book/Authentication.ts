import { ServiceResponse } from '../entity/ServiceResponse';
import { UserAuthorizationRequest, UserAuthorizationResponse } from '../entity/UserAuthorization';

export const authentication = (secretKey: string): Promise<ServiceResponse<UserAuthorizationResponse>> => {
    const url = process.env.REACT_APP_AIR_QUALITY_DATA_REMOTE_URL as string;

    return fetch(`${url}/app/user-authorization`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ secretKey: secretKey } as UserAuthorizationRequest)
    }).then((response): Promise<ServiceResponse<UserAuthorizationResponse>> => {
        return response.json();
    });
};