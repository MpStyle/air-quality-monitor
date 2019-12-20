import { ILogging } from "../book/Logging";
import { Errors } from "../entity/Errors";
import { measurementsSearch, MeasurementSearchRequest as MeasurementsSearchRequest, MeasurementSearchResponse as MeasurementsSearchResponse } from "./MeasurementsSearch";
import { authorization } from "./Authorization";
import { Service, buildErrorResponse, buildResponse } from "../entity/Service";

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
                return measurementsSearch(logging)(req)
                    .then(response => {
                        return buildResponse({
                            measurements: response.payload ? response.payload.measurements : []
                        }, response.error);
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