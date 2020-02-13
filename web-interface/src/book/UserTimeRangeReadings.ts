import { ServiceResponse } from "../entity/ServiceResponse";
import { TimeRangeReading } from "../entity/TimeRangeReading";

export const userTimeRangeReadings = (deviceId: string, accessToken: string, type: string, timestamp: number | undefined = undefined): Promise<ServiceResponse<UserTimeRangeMeasurementsSearchResponse>> => {
    const url = process.env.REACT_APP_AIR_QUALITY_DATA_REMOTE_URL as string;
    return fetch(`${url}/app/user-time-range-readings`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accessToken, deviceId, type, timestamp } as UserTimeRangeMeasurementsSearchRequest)
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
    timeRangeReadings: TimeRangeReading[];
}