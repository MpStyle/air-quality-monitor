import { ILogging } from "../book/Logging";
import { Errors } from "../entity/Errors";
import { Scopes } from "../entity/Scopes";
import { buildErrorResponse, buildResponse, Service } from "../entity/Service";
import { authorization } from "./Authorization";
import { MeasurementSearchRequest, measurementsSearch } from "./MeasurementsSearch";
import Bluebird = require("bluebird");

export const userMeasurementsSearch = (logging: ILogging): Service<UserMeasurementsSearchRequest, UserMeasurementsSearchResponse> => req => {
    try {
        if (!req.secretKey || req.secretKey === '') {
            return buildErrorResponse(Errors.INVALID_USER_MEASUREMENT_SEARCH_REQUEST);
        }

        logging.info("userMeasurementsSearch", "Starts");

        return authorization(logging)({ secretKey: req.secretKey })
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

                const measurementTypes = ['pressure', 'temperature', 'co2', 'humidity', 'tvoc'];

                return Bluebird
                    .map(measurementTypes, (measurementType, index) => {
                        return measurementsSearch(logging)(<MeasurementSearchRequest>{ deviceId: req.deviceId, limit: 1, type: measurementType });
                    }, { concurrency: 3 })
                    .then(results => results.reduce((acc, curr) => {
                        if (curr.error || !curr.payload || !curr.payload.measurements.length) {
                            return acc;
                        }

                        const value = curr.payload.measurements[0].value ? parseFloat(curr.payload.measurements[0].value) : null;
                        switch (curr.payload.measurements[0].type) {
                            case 'temperature': acc.temperature = value; break;
                            case 'co2': acc.co2 = value; break;
                            case 'humidity': acc.humidity = value; break;
                            case 'tvoc': acc.tvoc = value; break;
                            case 'pressure': acc.pressure = value; break;
                        }

                        if (!acc.inserted || acc.inserted > curr.payload.measurements[0].inserted) {
                            acc.inserted = curr.payload.measurements[0].inserted;
                        }

                        return acc;
                    }, {} as UserMeasurementsSearchResponse))
                    .then(response => buildResponse(response));
            })
            .catch((err: any) => {
                logging.error("userMeasurementSearch", `Error while searching measurements: ${err}`);
                return buildErrorResponse(err);
            });
    }
    catch (error) {
        logging.error("userMeasurementSearch", `Error while searching measurements: ${error}`);
        return buildErrorResponse(error);
    }
};

export interface UserMeasurementsSearchRequest {
    secretKey: string;
    deviceId: string;
}

export interface UserMeasurementsSearchResponse {
    humidity: number | null;
    temperature: number | null;
    pressure: number | null;
    tvoc: number | null;
    co2: number | null;
    inserted: number;
}