import { AirStatus } from "../entity/AirStatus";

export const averageAirStatus = (airStatus: AirStatus) => {
    return Math.round((
        airStatus.temperature +
        airStatus.co2 +
        airStatus.humidity +
        airStatus.pressure +
        airStatus.tvoc
    ) / 6);
};