import { Measurement } from "./Measurement";

export interface UserMeasurementsSearchRequest {
    secretKey: string;
    measurementId?: string;
    deviceId?: string;
    type?: string;
}

// tslint:disable-next-line: no-empty-interface
export interface UserMeasurementsSearchResponse {
    measurements: Measurement[];
}