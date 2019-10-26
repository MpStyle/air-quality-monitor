import { AirQuality } from "../entity/AirStatus";

export const airQualityToClassName = (s: AirQuality): string => {
    switch (s) {
        default:
        case AirQuality.Excellent: return "excellent";
        case AirQuality.Good: return "good";
        case AirQuality.NotGood: return "not-good";
        case AirQuality.VeryBad: return "very-bad";
    }
}; 