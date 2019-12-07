import { ILogging } from "../book/Logging";
import { Errors } from "../entity/Errors";
import { measurementsSearch, MeasurementSearchRequest as MeasurementsSearchRequest, MeasurementSearchResponse as MeasurementsSearchResponse } from "./MeasurementsSearch";
import { authorization } from "./Authorization"

export const userMeasurementsSearch = (logging: ILogging) => (req: UserMeasurementsSearchRequest): Promise<UserMeasurementsSearchResponse> => {
    try {
        if (!req.secretKey || req.secretKey === '') {
            return Promise.resolve(<MeasurementsSearchResponse>{ error: Errors.INVALID_USER_MEASUREMENT_SEARCH_REQUEST });
        }

        logging.info("userMeasurementsSearch", "Starts");

        return authorization(logging)({ secretKey: req.secretKey })
            .then(authorizationResponse => {
                if (authorizationResponse.error) {
                    return Promise.resolve({ error: authorizationResponse.error });
                }

                if (!authorizationResponse.payload) {
                    return Promise.resolve({ error: Errors.USER_UNAUTHORIZED });
                }
                return measurementsSearch(logging)(req)
                    .then(response => {
                        return Promise.resolve(<MeasurementsSearchResponse>{
                            payload: response.payload,
                            error: response.error
                        });
                    });
            })
            .catch((err: any) => {
                logging.error("userMeasurementSearch", `Error while searching measurements: ${err}`);
                return Promise.resolve(<MeasurementsSearchResponse>{ error: err })
            });
    }
    catch (error) {
        logging.error("userMeasurementSearch", `Error while searching measurements: ${error}`);
        return Promise.resolve(<MeasurementsSearchResponse>{ error: error })
    }
};

export interface UserMeasurementsSearchRequest extends MeasurementsSearchRequest {
    secretKey: string;
}

// tslint:disable-next-line: no-empty-interface
export interface UserMeasurementsSearchResponse extends MeasurementsSearchResponse {
}