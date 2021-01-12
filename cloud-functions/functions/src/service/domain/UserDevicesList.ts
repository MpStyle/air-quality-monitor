import { ILogging } from "../../book/Logging";
import { Errors } from "../../entity/Errors";
import { devicesSearch, DevicesSearchRequest, DevicesSearchResponse as DevicesSearchResponse } from '../crud/DevicesSearch';
import { userAuthorization } from "./UserAuthorization";
import { Service, buildErrorResponse, buildResponse } from "../../entity/Service";

export const userDevicesList = (logging: ILogging): Service<UserDevicesListRequest, UserDevicesListResponse> => req => {
    if (!req.accessToken || req.accessToken === '') {
        return buildErrorResponse(Errors.INVALID_USER_DEVICE_SEARCH_REQUEST);
    }

    logging.info("userDevicesList", "Starts");

    return userAuthorization(logging)({ accessToken: req.accessToken })
        .then(authorizationResponse => {
            if (authorizationResponse.error) {
                return buildErrorResponse(authorizationResponse.error);
            }

            if (!authorizationResponse.payload) {
                return buildErrorResponse(Errors.USER_UNAUTHORIZED);
            }

            return devicesSearch(logging)(req)
                .then(response => {
                    if (response.error) {
                        return buildErrorResponse(response.error);
                    }

                    if (!response.payload) {
                        return buildErrorResponse(Errors.DEVICE_NOT_FOUND);
                    }

                    return buildResponse<UserDevicesListResponse>({
                        devices: response.payload.devices
                    });
                });
        })
        .catch((error: any) => {
            logging.error("userDevicesList", `Error while searching devices: ${JSON.stringify(error)}`);
            return buildErrorResponse(Errors.ERROR_WHILE_LIST_DEVICE);
        });
};

export interface UserDevicesListRequest extends DevicesSearchRequest {
    accessToken: string,
}

// tslint:disable-next-line: no-empty-interface
export interface UserDevicesListResponse extends DevicesSearchResponse {
}