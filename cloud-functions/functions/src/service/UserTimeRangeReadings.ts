import { ILogging } from "../book/Logging";
import { Errors } from "../entity/Errors";
import { Scopes } from "../entity/Scopes";
import { buildErrorResponse, Service } from "../entity/Service";
import { TimeRangeReading } from '../entity/TimeRangeReading';
import { TimeRangeReadingSearchRequest, timeRangeReadingsSearch } from "./TimeRangeReadingsSearch";
import { userAuthorization } from "./UserAuthorization";

export const userTimeRangeReadings = (logging: ILogging): Service<UserTimeRangeReadingsRequest, UserTimeRangeReadingsResponse> => req => {
    if (
        !req.accessToken || req.accessToken === ''
        || !req.deviceId || req.deviceId === ''
        || !req.type || req.type === ''
    ) {
        return buildErrorResponse(Errors.INVALID_USER_READING_SEARCH_REQUEST);
    }

    logging.info("userTimeRangeReadings", "Starts");

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

            const searchRequest: TimeRangeReadingSearchRequest = {
                deviceId: req.deviceId,
                type: req.type
            };

            return timeRangeReadingsSearch(logging)(searchRequest);
        })
        .catch((err: any) => {
            logging.error("userTimeRangeReadings", `Error while searching time range readings: ${err}`);
            return buildErrorResponse(err);
        });
};

export interface UserTimeRangeReadingsRequest {
    accessToken: string;
    deviceId: string;
    type: string;
}

export interface UserTimeRangeReadingsResponse {
    timeRangeReadings: TimeRangeReading[];
}