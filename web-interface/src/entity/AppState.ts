import { AirQualityData } from "./AirQualityData";
import { AirStatus } from "./AirStatus";
import { Device } from "./Device";
import { MeterUnit } from "./MeterUnit";

export interface AppState {
    airQualityData: AirQualityData;
    meterUnit: MeterUnit;
    airStatus: AirStatus;
    devices: Device[];
    currentDevice: string | null;
    suggestions: string[];
}