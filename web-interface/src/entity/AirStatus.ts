export enum AirQuality {
    Excellent,
    Good,
    NotGood,
    VeryBad
}
export interface AirStatus {
    co2: AirQuality;
    tvoc: AirQuality;
    pressure: AirQuality;
    humidity: AirQuality;
    noise: AirQuality;
    temperature: AirQuality;
}