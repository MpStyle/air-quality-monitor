import { AirQuality } from "./AirQuality";

export interface AirStatus {
    co2: AirQuality;
    tvoc: AirQuality;
    pressure: AirQuality;
    humidity: AirQuality;
    temperature: AirQuality;
}