import { AirQualityData } from "./AirQualityData";
import { AirQualityDataAverages } from "./AirQualityDataAverages";
import { AirQuality, AirStatus } from "./AirStatus";
import { AppError } from "./AppError";
import { Device } from "./Device";
import { DevicesData } from "./DevicesData";
import { LoadingState } from "./LoadingState";
import { LoginToken } from "./LoginToken";
import { Settings } from "./Settings";

export interface AppState {
    lastReadingLoadingState: LoadingState;
    lastReadings: AirQualityData;
    airStatus: AirStatus;
    airStatusAverage: AirQuality;
    devicesData: DevicesData;
    currentDevice: Device | null;
    suggestions: string[];
    token: LoginToken | null;
    loginStatus: LoadingState;
    settings: Settings;
    airQualityDataAverages: AirQualityDataAverages;
    appErrors: AppError[];
}