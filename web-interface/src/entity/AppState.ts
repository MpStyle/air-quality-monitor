import { AirQualityData } from "./AirQualityData";
import { AirStatus } from "./AirStatus";
import { Device } from "./Device";
import { LoginStatus } from "./LoginStatus";
import { LoginToken } from "./LoginToken";
import { MeterUnit } from "./MeterUnit";

export interface AppState {
    airQualityData: AirQualityData;
    meterUnit: MeterUnit;
    airStatus: AirStatus;
    devices: Device[];
    currentDevice: Device | null;
    suggestions: string[];
    token: LoginToken | null;
    decimalSeparator: string;
    loginStatus: LoginStatus;
}