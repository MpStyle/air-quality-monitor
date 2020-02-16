export interface Device {
    deviceId: string;
    address?: string;
    inserted: number;
    deviceIP: string;
    name: string;
    enabled: boolean;
    updated: number;
}