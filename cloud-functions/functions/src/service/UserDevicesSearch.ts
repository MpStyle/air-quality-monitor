import { ILogging } from "../book/Logging";
import { Errors } from "../entity/Errors";
import { devicesSearch, DevicesSearchRequest, DevicesSearchResponse as DevicesSearchResponse } from './DevicesSearch';
import { authorization } from "./Authorization";
import { Service, buildErrorResponse, buildResponse } from "../entity/Service";

export const userDevicesSearch = (logging: ILogging): Service<UserDevicesSearchRequest, UserDevicesSearchResponse> => req => {
    try {
        if (!req.secretKey || req.secretKey === '') {
            return buildErrorResponse(Errors.INVALID_USER_DEVICE_SEARCH_REQUEST);
        }

        logging.info("userDevicesSearch", "Starts");

        return authorization(logging)({ secretKey: req.secretKey })
            .then(authorizationResponse => {
                if (authorizationResponse.error) {
                    return buildErrorResponse(authorizationResponse.error);
                }

                if (!authorizationResponse.payload) {
                    return buildErrorResponse(Errors.USER_UNAUTHORIZED);
                }

                return devicesSearch(logging)(req)
                    .then(response => buildResponse<UserDevicesSearchResponse>({ devices: response.payload ? response.payload.devices : [] }, response.error));
            })
            .catch((err: any) => {
                logging.error("userDevicesSearch", `Error while searching devices: ${err}`);
                return buildErrorResponse(err);
            });
    }
    catch (error) {
        logging.error("userDevicesSearch", `Error while searching devices: ${error}`);
        return buildErrorResponse(error);
    }
};

export interface UserDevicesSearchRequest extends DevicesSearchRequest {
    secretKey: string,
}

// tslint:disable-next-line: no-empty-interface
export interface UserDevicesSearchResponse extends DevicesSearchResponse {
}