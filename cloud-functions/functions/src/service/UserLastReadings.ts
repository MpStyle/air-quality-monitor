import { ILogging } from "../book/Logging";
import { Errors } from "../entity/Errors";
import { Scopes } from "../entity/Scopes";
import { buildErrorResponse, buildResponse, Service } from "../entity/Service";
import { userAuthorization } from "./UserAuthorization";
import { ReadingSearchRequest, readingsSearch } from "./ReadingsSearch";
import Bluebird = require("bluebird");
import { ReadingTypes } from "../entity/ReadingTypes";

export const userLastReadings = (logging: ILogging): Service<UserLastReadingsRequest, UserLastReadingsResponse> => req => {
    try {
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

                        const value = curr.payload.readings[0].value ? parseFloat(curr.payload.readings[0].value) : null;
                        switch (curr.payload.readings[0].type) {
                            case ReadingTypes.TEMPERATURE: acc.temperature = value; break;
                            case ReadingTypes.CO2: acc.co2 = value; break;
                            case ReadingTypes.HUMIDITY: acc.humidity = value; break;
                            case ReadingTypes.TVOC: acc.tvoc = value; break;
                            case ReadingTypes.PRESSURE: acc.pressure = value; break;
                        }

                        if (!acc.inserted || acc.inserted > curr.payload.readings[0].inserted) {
                            acc.inserted = curr.payload.readings[0].inserted;
                        }

                        return acc;
                    }, {} as UserLastReadingsResponse))
                    .then(response => buildResponse(response));
            })
            .catch((err: any) => {
                logging.error("userLastReadings", `Error while searching readings: ${err}`);
                return buildErrorResponse(err);
            });
    }
    catch (error) {
        logging.error("userLastReadings", `Error while searching readings: ${error}`);
        return buildErrorResponse(error);
    }
};

export interface UserLastReadingsRequest {
    accessToken: string;
    deviceId: string;
}

export interface UserLastReadingsResponse {
    humidity: number | null;
    temperature: number | null;
    pressure: number | null;
    tvoc: number | null;
    co2: number | null;
    inserted: number;
}