import { AirQualityData } from "./AirQualityData";
import { AirStatus } from "./AirStatus";
import { Device } from "./Device";
import { LoginToken } from "./LoginToken";
import { MeterUnit } from "./MeterUnit";

export interface AppState {
    airQualityData: AirQualityData;
    meterUnit: MeterUnit;
    airStatus: AirStatus;
    devices: Device[];
    currentDevice: string | null;
    suggestions: string[];
    token: LoginToken | null;
    decimalSeparator: string;
}