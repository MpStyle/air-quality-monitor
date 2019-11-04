import { ILogging } from "../book/Logging";
import { Errors } from "../entity/Errors";
import { deviceSearch, DeviceSearchRequest, DeviceSearchResponse } from './DeviceSearch';
import { userAuthentication, UserAuthenticationResponse } from "./UserAuthentication";

export const userDeviceSearch = (logging: ILogging) => (req: UserDeviceSearchRequest): Promise<UserDeviceSearchResponse> => {
    if (!req.token || req.token === '') {
        return Promise.resolve(<UserDeviceSearchResponse>{ error: Errors.INVALID_USER_DEVICE_SEARCH_REQUEST });
    }

    logging.info("userDeviceSearch", "Starts");

    return userAuthentication(logging)({ token: req.token })
        .then((userAuthenticationResponse: UserAuthenticationResponse) => {
            if (userAuthenticationResponse.error) {
                return Promise.resolve({ error: userAuthenticationResponse.error });
            }

            if (!userAuthenticationResponse.payload) {
                return Promise.resolve({ error: Errors.USER_UNAUTHORIZED });
            }

            return deviceSearch(logging)(req)
                .then(response => <UserDeviceSearchResponse>{ payload: response.payload, error: response.error });
        })
        .catch((err: any) => {
            logging.error("userDeviceSearch", `Error while searching device: ${err}`);
            return Promise.resolve(<UserDeviceSearchResponse>{ error: err })
        });
};

export interface UserDeviceSearchRequest extends DeviceSearchRequest {
    token: string;
}

// tslint:disable-next-line: no-empty-interface
export interface UserDeviceSearchResponse extends DeviceSearchResponse {
}