import { AirQualityData } from "./AirQualityData";
import { AirQualityDataAverages } from "./AirQualityDataAverages";
import { AirQuality, AirStatus } from "./AirStatus";
import { AppError } from "./AppError";
import { Device } from "./Device";
import { DevicesData } from "./DevicesData";
import { LoadingState } from "./LoadingState";
import { LoginTokenStatus } from "./LoginTokenStatus";
import { Settings } from "./Settings";

export interface AppState {
    lastReadingLoadingState: LoadingState;
    lastReadings: AirQualityData;
    airStatus: AirStatus;
    airStatusAverage: AirQuality;
    devicesData: DevicesData;
    currentDevice: Device | null;
    suggestions: string[];
    loginTokenStatus: LoginTokenStatus;
    settings: Settings;
    airQualityDataAverages: AirQualityDataAverages;
    appErrors: AppError[];
}