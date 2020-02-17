import { ILogging } from "../../book/Logging";
import { Errors } from "../../entity/Errors";
import { Scopes } from "../../entity/Scopes";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import { userAuthorization } from "./UserAuthorization";
import { ReadingSearchRequest, readingsSearch } from "../crud/ReadingsSearch";
import Bluebird = require("bluebird");
import { ReadingTypes } from "../../entity/ReadingTypes";
import { AirStatus } from "../../entity/AirStatus";
import { userSuggestions } from "./UserSuggestions";
import { AirQuality } from "../../entity/AirQuality";
import { userAirStatus } from "./UserAirStatus";
import { userAirStatusAverage } from "./UserAirStatusAverage";

export const userLastReadings = (logging: ILogging): Service<UserLastReadingsRequest, UserLastReadingsResponse> => req => {
    if (!req.accessToken || req.accessToken === '' || !req.deviceId || req.deviceId === '') {
        return buildErrorResponse(Errors.INVALID_USER_READING_SEARCH_REQUEST);
    }

    logging.info("userLastReadings", "Starts");

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

            const readingTypes = [ReadingTypes.PRESSURE, ReadingTypes.TEMPERATURE, ReadingTypes.CO2, ReadingTypes.HUMIDITY, ReadingTypes.TVOC];

            return Bluebird
                .map(readingTypes, (readingType) => {
                    return readingsSearch(logging)(<ReadingSearchRequest>{ deviceId: req.deviceId, limit: 1, type: readingType });
                }, { concurrency: 3 })
                .then(results => results.reduce((acc, curr) => {
                    if (curr.error || !curr.payload || !curr.payload.readings.length) {
                        return acc;
                    }

                    const value = curr.payload.readings[0].value ? curr.payload.readings[0].value : null;
                    switch (curr.payload.readings[0].type) {
                        case ReadingTypes.TEMPERATURE: acc.data.temperature = value; break;
                        case ReadingTypes.CO2: acc.data.co2 = value; break;
                        case ReadingTypes.HUMIDITY: acc.data.humidity = value; break;
                        case ReadingTypes.TVOC: acc.data.tvoc = value; break;
                        case ReadingTypes.PRESSURE: acc.data.pressure = value; break;
                    }

                    if (!acc.data.inserted || acc.data.inserted > curr.payload.readings[0].inserted) {
                        acc.data.inserted = curr.payload.readings[0].inserted;
                    }

                    return acc;
                }, { data: {} } as UserLastReadingsResponse))
                .then(response => {
                    return userAirStatus(logging)(response.data)
                        .then(userAirStatusResponse => {
                            if (userAirStatusResponse.error) {
                                return buildErrorResponse(userAirStatusResponse.error);
                            }

                            if (!userAirStatusResponse.payload || !userAirStatusResponse.payload.airstatus) {
                                return buildErrorResponse(Errors.ERROR_WHILE_FETCH_AIR_STATUS);
                            }

                            const airQualityStatus = userAirStatusResponse.payload.airstatus;

                            return userSuggestions(logging)({ airStatus: userAirStatusResponse.payload.airstatus, language: 'en' })
                                .then(userSuggestionsResponse => {
                                    if (userSuggestionsResponse.error) {
                                        return buildErrorResponse(userSuggestionsResponse.error);
                                    }

                                    if (!userSuggestionsResponse.payload || !userSuggestionsResponse.payload.suggestions) {
                                        return buildErrorResponse(Errors.ERROR_WHILE_FETCH_SUGGESTIONS);
                                    }

                                    const suggestions = userSuggestionsResponse.payload.suggestions;

                                    return userAirStatusAverage(logging)({ airStatus: airQualityStatus })
                                        .then(userAirStatusAverageResponse => {
                                            if (userAirStatusAverageResponse.error) {
                                                return buildErrorResponse(userAirStatusAverageResponse.error);
                                            }

                                            console.log(userAirStatusAverageResponse);

                                            if (!userAirStatusAverageResponse.payload || userAirStatusAverageResponse.payload.average === null || userAirStatusAverageResponse.payload.average === undefined) {
                                                return buildErrorResponse(Errors.ERROR_WHILE_FETCH_AIRSTATUS_AVERAGE);
                                            }

                                            return buildResponse<UserLastReadingsResponse>({
                                                averageStatus: userAirStatusAverageResponse.payload.average,
                                                data: response.data,
                                                status: airQualityStatus,
                                                suggestions: suggestions
                                            });
                                        });
                                });
                        })
                });
        })
        .catch((err: any) => {
            logging.error("userLastReadings", `Error while searching readings: ${err}`);
            return buildErrorResponse(err);
        });
};

export interface UserLastReadingsRequest {
    accessToken: string;
    deviceId: string;
}

export interface UserLastReadingsResponse {
    data: {
        humidity: number | null;
        temperature: number | null;
        pressure: number | null;
        tvoc: number | null;
        co2: number | null;
        inserted: number;
    };
    status: AirStatus;
    averageStatus: AirQuality;
    suggestions: string[];
}