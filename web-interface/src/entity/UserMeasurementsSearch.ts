import { Measurement } from "./Measurement";

export interface UserMeasurementsSearchRequest {
    secretKey: string;
    measurementId?: string;
    deviceId?: string;
    type?: string;
}

// tslint:disable-next-line: no-empty-interface
export interface UserMeasurementsSearchResponse {
    humidity: number | null;
    temperature: number | null;
    pressure: number | null;
    tvoc: number | null;
    co2: number | null;
    inserted: number;
}