import { AirQuality } from "../entity/AirStatus";

export const airQualityToLabel = (s: AirQuality): string => {
    switch (s) {
        case AirQuality.Excellent: return "Excellent";
        case AirQuality.Good: return "Good";
        case AirQuality.NotGood: return "Not good";
        case AirQuality.VeryBad: return "Very Bad";
        default: return "...";
    }
};