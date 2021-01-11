export interface Device {
    deviceId: string;
    address?: string;
    inserted: number;
    deviceIP: string;
    name: string;
    enabled: boolean;
    updated: number;
    wifiName: string;
    wifiSignalStrength: number;
    ip: string;
    scope: string;
    secretKey: string;
}