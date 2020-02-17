import { AirQuality, AirStatus } from "../entity/AirStatus";
import { ServiceResponse } from "../entity/ServiceResponse";

export const userLastReadings = (currentDeviceId: string, accessToken: String): Promise<ServiceResponse<UserMeasurementsSearchResponse>> => {
    const url = process.env.REACT_APP_AIR_QUALITY_DATA_REMOTE_URL as string;
    return fetch(`${url}/app/user-last-readings`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accessToken: accessToken, deviceId: currentDeviceId } as UserMeasurementsSearchRequest)
    }).then((response): Promise<ServiceResponse<UserMeasurementsSearchResponse>> => {
        return response.json();
    });
};

export interface UserMeasurementsSearchRequest {
    accessToken: string;
    deviceId: string;
}

export interface UserMeasurementsSearchResponse {
    data: {
        humidity: number | null;
        temperature: number | null;
        pressure: number | null;
        tvoc: number | null;
        co2: number | null;
        inserted: number;
    };
    status: AirStatus;
    averageStatus: AirQuality;
    suggestions: string[];
}