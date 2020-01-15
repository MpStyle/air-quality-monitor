import { ServiceResponse } from "../entity/ServiceResponse";
import { TimeRangeMeasurement } from "../entity/TimeRangeMeasurement";

export const userTimeRangeMeasurementsSearch = (deviceId: string, accessToken: string, type: string): Promise<ServiceResponse<UserTimeRangeMeasurementsSearchResponse>> => {
    const url = process.env.REACT_APP_AIR_QUALITY_DATA_REMOTE_URL as string;
    return fetch(`${url}/app/user-time-range-measurements-search`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accessToken, deviceId, type } as UserTimeRangeMeasurementsSearchRequest)
    }).then((response): Promise<ServiceResponse<UserTimeRangeMeasurementsSearchResponse>> => {
        return response.json();
    });
};

export interface UserTimeRangeMeasurementsSearchRequest {
    accessToken: string;
    deviceId: string;
    type: string;
}

export interface UserTimeRangeMeasurementsSearchResponse {
    timeRangeMeasurements: TimeRangeMeasurement[];
}