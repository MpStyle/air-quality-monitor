import { Device } from '../entity/Device';
import { ServiceResponse } from '../entity/ServiceResponse';

export const userDevicesList = (accessToken: string): Promise<ServiceResponse<UserDevicesSearchResponse>> => {
    const url = process.env.REACT_APP_AIR_QUALITY_DATA_REMOTE_URL as string;
    return fetch(`${url}/app/user-devices-list`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accessToken: accessToken } as UserDevicesSearchRequest)
    }).then((response): Promise<ServiceResponse<UserDevicesSearchResponse>> => {
        return response.json();
    });
};

interface UserDevicesSearchRequest {
    accessToken: string;
    deviceId: string;
}

export interface UserDevicesSearchResponse {
    devices: Device[];
}