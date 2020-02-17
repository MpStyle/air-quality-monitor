import { ILogging } from "../../book/Logging";
import { Service, buildResponse } from "../../entity/Service";
import { AirQuality } from "../../entity/AirQuality";
import { AirStatus } from "../../entity/AirStatus";

export const userAirStatus = (logging: ILogging): Service<UserAirStatusRequest, UserAirStatusResponse> => req => {
    logging.info("userAirStatus", "Starts");

    const humidityQuality = (humidity: number): AirQuality => {
        if (humidity <= 15) {
            return AirQuality.VeryBad;
        }

        if (humidity >= 85) {
            return AirQuality.VeryBad;
        }

        if (humidity <= 35) {
            return AirQuality.NotGood;
        }

        if (humidity >= 65) {
            return AirQuality.NotGood;
        }

        if (humidity < 45) {
            return AirQuality.Good;
        }

        if (humidity > 55) {
            return AirQuality.Good;
        }

        return AirQuality.Excellent;
    };

    const temperatureQuality = (temperature: number): AirQuality => {
        if (temperature > 35 || temperature < 0) {
            return AirQuality.VeryBad;
        }

        if (temperature > 30 || temperature < 10) {
            return AirQuality.NotGood;
        }

        if (temperature > 25 || temperature < 20) {
            return AirQuality.Good;
        }

        return AirQuality.Excellent;
    };

    const co2Quality = (co2: number): AirQuality => {
        if (co2 > 1600) {
            return AirQuality.VeryBad;
        }

        if (co2 > 1000) {
            return AirQuality.NotGood;
        }

        if (co2 > 700) {
            return AirQuality.Good;
        }

        return AirQuality.Excellent;
    };

    const tvocQuality = (tvoc: number): AirQuality => {
        if (tvoc >= 660) {
            return AirQuality.VeryBad;
        }

        if (tvoc >= 220 && tvoc < 660) {
            return AirQuality.NotGood;
        }

        if (tvoc >= 65 && tvoc < 220) {
            return AirQuality.Good;
        }

        return AirQuality.Excellent;
    };

    return buildResponse<UserAirStatusResponse>({
        airstatus: {
            co2: co2Quality(req.co2 as number),
            humidity: humidityQuality(req.humidity as number),
            temperature: temperatureQuality(req.temperature as number),
            pressure: AirQuality.Excellent,
            tvoc: tvocQuality(req.tvoc as number),
        }
    });
}

export interface UserAirStatusRequest {
    humidity: number | null;
    temperature: number | null;
    pressure: number | null;
    tvoc: number | null;
    co2: number | null;
}

export interface UserAirStatusResponse {
    airstatus: AirStatus;
}