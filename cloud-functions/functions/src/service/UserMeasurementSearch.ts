import { ILogging } from "../book/Logging";
import { Errors } from "../entity/Errors";
import { measurementSearch, MeasurementSearchRequest, MeasurementSearchResponse } from "./MeasurementSearch";
import { userAuthentication, UserAuthenticationResponse } from "./UserAuthentication";

export const userMeasurementSearch = (logging: ILogging) => (req: UserMeasurementSearchRequest): Promise<UserMeasurementSearchResponse> => {
    if (!req.token || req.token === '') {
        return Promise.resolve(<MeasurementSearchResponse>{ error: Errors.INVALID_USER_MEASUREMENT_SEARCH_REQUEST });
    }

    logging.info("userMeasurementSearch", "Starts");

    return userAuthentication(logging)({ token: req.token })
        .then((userAuthenticationResponse: UserAuthenticationResponse) => {
            if (userAuthenticationResponse.error) {
                return Promise.resolve({ error: userAuthenticationResponse.error });
            }

            if (!userAuthenticationResponse.payload) {
                return Promise.resolve({ error: Errors.USER_UNAUTHORIZED });
            }

            return measurementSearch(logging)(req)
                .then(response => <MeasurementSearchResponse>{ payload: response.payload, error: response.error });
        })
        .catch((err: any) => {
            logging.error("userMeasurementSearch", `Error while searching device: ${err}`);
            return Promise.resolve(<MeasurementSearchResponse>{ error: err })
        });
};

export interface UserMeasurementSearchRequest extends MeasurementSearchRequest {
    token: string;
}

// tslint:disable-next-line: no-empty-interface
export interface UserMeasurementSearchResponse extends MeasurementSearchResponse {
}