import { AirQualityData } from "./AirQualityData";
import { AirQualityDataAverages } from "./AirQualityDataAverages";
import { AirStatus } from "./AirStatus";
import { Device } from "./Device";
import { LoginStatus } from "./LoginStatus";
import { LoginToken } from "./LoginToken";
import { MeterUnit } from "./MeterUnit";

export interface AppState {
    airQualityData: AirQualityData;
    airStatus: AirStatus;
    devices: Device[];
    currentDevice: Device | null;
    suggestions: string[];
    token: LoginToken | null;
    loginStatus: LoginStatus;
    settings: Settings;
    airQualityDataAverages: AirQualityDataAverages;
}

export interface Settings {
    iconVisualizationType: string;
    decimalSeparator: string;
    meterUnit: MeterUnit;
}