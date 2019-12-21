import { ServiceResponse } from "../entity/ServiceResponse";
import { UserMeasurementsSearchRequest, UserMeasurementsSearchResponse } from "../entity/UserMeasurementsSearch";

export const fetchAirQualityData = (currentDeviceId: string, secretKey: String): Promise<ServiceResponse<UserMeasurementsSearchResponse>> => {
    const url = process.env.REACT_APP_AIR_QUALITY_DATA_REMOTE_URL as string;
    return fetch(`${url}/app/user-measurements-search`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ secretKey: secretKey, deviceId: currentDeviceId } as UserMeasurementsSearchRequest)
    }).then((response): Promise<ServiceResponse<UserMeasurementsSearchResponse>> => {
        return response.json();
    });
};