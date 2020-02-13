import { epochToLocaleDate } from "../../book/DateTimeUtils";
import { ILogging } from "../../book/Logging";
import { Errors } from "../../entity/Errors";
import { Granularity } from "../../entity/Granularity";
import { Scopes } from "../../entity/Scopes";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import { TimeRangeReading } from '../../entity/TimeRangeReading';
import { TimeRangeReadingSearchRequest, timeRangeReadingsSearch } from "../crud/TimeRangeReadingsSearch";
import { StringUtils } from './../../book/StringUtils';
import { userAuthorization } from "./UserAuthorization";
import Bluebird = require("bluebird");

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

            let timeRangeDaily = undefined;
            let timeRangeMonthly = undefined;
            let timeRangeYearly = undefined;
            if (req.timestamp) {
                const dateTime = epochToLocaleDate(req.timestamp);
                timeRangeDaily = dateTime.getUTCFullYear() + StringUtils.padLeft(dateTime.getUTCMonth() + 1, '0', 2) + StringUtils.padLeft(dateTime.getUTCDate() + 1, '0', 2);
                timeRangeMonthly = dateTime.getUTCFullYear() + StringUtils.padLeft(dateTime.getUTCMonth() + 1, '0', 2);
                timeRangeYearly = dateTime.getUTCFullYear().toString();
            }

            const searchRequests: TimeRangeReadingSearchRequest[] = [
                {
                    deviceId: req.deviceId,
                    type: req.type,
                    granularity: Granularity.daily,
                    timeRange: timeRangeDaily
                },
                {
                    deviceId: req.deviceId,
                    type: req.type,
                    granularity: Granularity.monthly,
                    timeRange: timeRangeMonthly
                },
                {
                    deviceId: req.deviceId,
                    type: req.type,
                    granularity: Granularity.yearly,
                    timeRange: timeRangeYearly
                }
            ];

            return Bluebird
                .map(searchRequests, (searchRequest) => timeRangeReadingsSearch(logging)(searchRequest), { concurrency: 3 })
                .then(responses => {
                    return responses.reduce((acc, curr) => {
                        if (curr.payload && curr.payload.timeRangeReadings) {
                            return acc.concat(curr.payload.timeRangeReadings);
                        }

                        return acc;
                    }, new Array<TimeRangeReading>());
                })
                .then(result => {
                    return buildResponse<UserTimeRangeReadingsResponse>({ timeRangeReadings: result });
                });
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

    /**
     * (UTC) Epoch in milliseconds of the client.
     * Used to fileter the data.
     */
    timestamp: number;
}

export interface UserTimeRangeReadingsResponse {
    timeRangeReadings: TimeRangeReading[];
}