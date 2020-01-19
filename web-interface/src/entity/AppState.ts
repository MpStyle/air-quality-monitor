import { AirQualityData } from "./AirQualityData";
import { AirQualityDataAverages } from "./AirQualityDataAverages";
import { AirStatus } from "./AirStatus";
import { Device } from "./Device";
import { DevicesData } from "./DevicesData";
import { LoginStatus } from "./LoginStatus";
import { LoginToken } from "./LoginToken";
import { Settings } from "./Settings";

export interface AppState {
    airQualityData: AirQualityData;
    airStatus: AirStatus;
    devicesData: DevicesData;
    currentDevice: Device | null;
    suggestions: string[];
    token: LoginToken | null;
    loginStatus: LoginStatus;
    settings: Settings;
    airQualityDataAverages: AirQualityDataAverages;
}