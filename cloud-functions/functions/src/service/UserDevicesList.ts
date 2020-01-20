import { ILogging } from "../book/Logging";
import { Errors } from "../entity/Errors";
import { devicesSearch, DevicesSearchRequest, DevicesSearchResponse as DevicesSearchResponse } from './DevicesSearch';
import { userAuthorization } from "./UserAuthorization";
import { Service, buildErrorResponse, buildResponse } from "../entity/Service";
import { Scopes } from "../entity/Scopes";

export const userDevicesList = (logging: ILogging): Service<UserDevicesListRequest, UserDevicesListResponse> => req => {
    try {
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

                const deviceIds = authorizationResponse.payload.authorizations
                    .filter(a => a.scopes.indexOf(Scopes.device_air_quality_data_read) !== -1)
                    .map(a => a.deviceId);

                return devicesSearch(logging)(req)
                    .then(response => {
                        if (response.error) {
                            return buildErrorResponse(response.error);
                        }

                        if (!response.payload) {
                            return buildErrorResponse(Errors.DEVICE_NOT_FOUND);
                        }

                        return buildResponse<UserDevicesListResponse>({
                            devices: response.payload.devices.filter(d => deviceIds.indexOf(d.deviceId) !== -1)
                        });
                    });
            })
            .catch((err: any) => {
                logging.error("userDevicesList", `Error while searching devices: ${err}`);
                return buildErrorResponse(err);
            });
    }
    catch (error) {
        logging.error("userDevicesList", `Error while searching devices: ${error}`);
        return buildErrorResponse(error);
    }
};

export interface UserDevicesListRequest extends DevicesSearchRequest {
    accessToken: string,
}

// tslint:disable-next-line: no-empty-interface
export interface UserDevicesListResponse extends DevicesSearchResponse {
}