import { ServiceResponse } from '../entity/ServiceResponse';

export const userDeviceDelete = (accessToken: string, deviceId: String): Promise<ServiceResponse<{}>> => {
    const url = process.env.REACT_APP_AIR_QUALITY_DATA_REMOTE_URL as string;
    return fetch(`${url}/app/user-device-delete`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accessToken: accessToken, deviceId: deviceId } as UserDeviceDeleteRequest)
    }).then((response): Promise<ServiceResponse<{}>> => {
        return response.json();
    });
};

interface UserDeviceDeleteRequest {
    accessToken: string;
    deviceId: string;
}