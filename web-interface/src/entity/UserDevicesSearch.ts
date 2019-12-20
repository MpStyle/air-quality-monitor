import { Device } from "./Device";

export interface UserDevicesSearchRequest {
    secretKey: string;
    deviceId: string;
}

export interface UserDevicesSearchResponse {
    devices: Device[];
}