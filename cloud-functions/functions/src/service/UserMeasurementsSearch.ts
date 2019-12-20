import { ILogging } from "../book/Logging";
import { Errors } from "../entity/Errors";
import { Scopes } from "../entity/Scopes";
import { buildErrorResponse, buildResponse, Service } from "../entity/Service";
import { authorization } from "./Authorization";
import { MeasurementSearchRequest as MeasurementsSearchRequest, MeasurementSearchResponse as MeasurementsSearchResponse, measurementsSearch } from "./MeasurementsSearch";

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

                return measurementsSearch(logging)(req)
                    .then(response => {
                        if (response.error) {
                            return buildErrorResponse(response.error);
                        }

                        if (!response.payload) {
                            return buildErrorResponse(Errors.MEASUREMENT_NOT_FOUND);
                        }

                        return buildResponse<UserMeasurementsSearchResponse>({
                            measurements: response.payload.measurements.filter(m => deviceIds.indexOf(m.deviceId) !== -1)
                        });
                    });
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

export interface UserMeasurementsSearchRequest extends MeasurementsSearchRequest {
    secretKey: string;
}

// tslint:disable-next-line: no-empty-interface
export interface UserMeasurementsSearchResponse extends MeasurementsSearchResponse {
}