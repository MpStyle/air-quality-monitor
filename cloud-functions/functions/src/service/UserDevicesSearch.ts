import { ILogging } from "../book/Logging";
import { Errors } from "../entity/Errors";
import { devicesSearch, DevicesSearchRequest, DevicesSearchResponse as DevicesSearchResponse } from './DevicesSearch';
import { authorization } from "./Authorization"

export const userDevicesSearch = (logging: ILogging) => (req: UserDevicesSearchRequest): Promise<UserDevicesSearchResponse> => {
    try {
        if (!req.secretKey || req.secretKey === '') {
            return Promise.resolve(<UserDevicesSearchResponse>{ error: Errors.INVALID_USER_DEVICE_SEARCH_REQUEST });
        }

        logging.info("userDevicesSearch", "Starts");

        return authorization(logging)({ secretKey: req.secretKey })
            .then(authorizationResponse => {
                if (authorizationResponse.error) {
                    return Promise.resolve({ error: authorizationResponse.error });
                }

                if (!authorizationResponse.payload) {
                    return Promise.resolve({ error: Errors.USER_UNAUTHORIZED });
                }

                return devicesSearch(logging)(req)
                    .then(response => <UserDevicesSearchResponse>{ payload: response.payload, error: response.error });
            })
            .catch((err: any) => {
                logging.error("userDevicesSearch", `Error while searching devices: ${err}`);
                return Promise.resolve(<UserDevicesSearchResponse>{ error: err })
            });
    }
    catch (error) {
        logging.error("userDevicesSearch", `Error while searching devices: ${error}`);
        return Promise.resolve(<UserDevicesSearchResponse>{ error: error })
    }
};

export interface UserDevicesSearchRequest extends DevicesSearchRequest {
    secretKey: string,
}

// tslint:disable-next-line: no-empty-interface
export interface UserDevicesSearchResponse extends DevicesSearchResponse {
}