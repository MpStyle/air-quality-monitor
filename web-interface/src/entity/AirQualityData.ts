import { LoadingState } from "./LoadingState";

export interface AirQualityData {
    inserted: number;
    co2: number;
    tvoc: number;
    pressure: number;
    humidity: number;
    temperature: number;
}