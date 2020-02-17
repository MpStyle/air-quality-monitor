import { ILogging } from "../../book/Logging";
import { Service, buildResponse } from "../../entity/Service";
import { AirStatus } from "../../entity/AirStatus";
import { AirQuality } from "../../entity/AirQuality";

export const userAirStatusAverage = (logging: ILogging): Service<UserAirStatusAverageRequest, UserAirStatusAverageResponse> => req => {
    logging.info("userAirStatusAverage", "Starts");

    return buildResponse<UserAirStatusAverageResponse>({
        average: Math.round((
            req.airStatus.temperature +
            req.airStatus.co2 +
            req.airStatus.humidity +
            req.airStatus.pressure +
            req.airStatus.tvoc
        ) / 6)
    });
}

export interface UserAirStatusAverageRequest {
    airStatus: AirStatus;
}

export interface UserAirStatusAverageResponse {
    average: AirQuality;
}