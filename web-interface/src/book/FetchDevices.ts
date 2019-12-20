import { ServiceResponse } from '../entity/ServiceResponse';
import { UserDevicesSearchRequest, UserDevicesSearchResponse } from '../entity/UserDevicesSearch';

export const fetchDevices = (secretKey: string): Promise<ServiceResponse<UserDevicesSearchResponse>> => {
    const url = process.env.REACT_APP_AIR_QUALITY_DATA_REMOTE_URL as string;
    return fetch(`${url}/app/user-devices-search`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ secretKey: secretKey } as UserDevicesSearchRequest)
    }).then((response): Promise<ServiceResponse<UserDevicesSearchResponse>> => {
        return response.json();
    });
};