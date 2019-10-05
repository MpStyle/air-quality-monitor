export interface Device {
    googleEmail: string;
    deviceId: string;
    address: string;
    room: string;
    inserted: number;
    updated: number;
    name: string;
    deleted: boolean;
    tokens: string[];
    tokenDueDate: number;
}