import { ILogging } from "../book/Logging";
import { Errors } from "../entity/Errors";
import { Scopes } from "../entity/Scopes";
import { buildErrorResponse, Service } from "../entity/Service";
import { TimeRangeMeasurement } from './../entity/TimeRangeMeasurement';
import { TimeRangeMeasurementSearchRequest, timeRangeMeasurementsSearch } from "./TimeRangeMeasurementsSearch";
import { userAuthorization } from "./UserAuthorization";

export const userTimeRangeMeasurementsSearch = (logging: ILogging): Service<UserTimeRangeMeasurementsSearchRequest, UserTimeRangeMeasurementsSearchResponse> => req => {
    try {
        if (
            !req.accessToken || req.accessToken === ''
            || !req.deviceId || req.deviceId === ''
            || !req.timeRange || req.timeRange === ''
            || !req.type || req.type === ''
        ) {
            return buildErrorResponse(Errors.INVALID_USER_MEASUREMENT_SEARCH_REQUEST);
        }

        logging.info("userTimeRangeMeasurementsSearch", "Starts");

        return userAuthorization(logging)({ accessToken: req.accessToken })
            .then(authorizationResponse => {
                if (authorizationResponse.error) {
                    return buildErrorResponse(authorizationResponse.error);
                }

                if (!authorizationResponse.payload) {
                    return buildErrorResponse(Errors.USER_UNAUTHORIZED);
                }

                const deviceIds = authorizationResponse.payload.authorizations
                    .filter(a => a.scopes.indexOf(Scopes.device_air_quality_data_read) !== -1)
                    .map(a => a.deviceId);

                if (deviceIds.indexOf(req.deviceId) === -1) {
                    return buildErrorResponse(Errors.DEVICE_AUTHORIZATION_ERROR);
                }

                return timeRangeMeasurementsSearch(logging)(<TimeRangeMeasurementSearchRequest>{
                    deviceId: req.deviceId,
                    type: req.type,
                    timeRange: req.timeRange
                });
            })
            .catch((err: any) => {
                logging.error("userTimeRangeMeasurementsSearch", `Error while searching time range measurements: ${err}`);
                return buildErrorResponse(err);
            });
    }
    catch (error) {
        logging.error("userTimeRangeMeasurementsSearch", `Error while searching time range measurements: ${error}`);
        return buildErrorResponse(error);
    }
};

export interface UserTimeRangeMeasurementsSearchRequest {
    accessToken: string;
    deviceId: string;
    timeRange: string;
    type: string;
}

export interface UserTimeRangeMeasurementsSearchResponse {
    timeRangeMeasurement: TimeRangeMeasurement;
}