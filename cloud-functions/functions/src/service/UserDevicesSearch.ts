import { ILogging } from "../book/Logging";
import { Errors } from "../entity/Errors";
import { devicesSearch, DevicesSearchRequest, DevicesSearchResponse as DevicesSearchResponse } from './DevicesSearch';
import { authorization } from "./Authorization";
import { Service, buildErrorResponse, buildResponse } from "../entity/Service";
import { Scopes } from "../entity/Scopes";

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

                        return buildResponse<UserDevicesSearchResponse>({
                            devices: response.payload.devices.filter(d => deviceIds.indexOf(d.deviceId) !== -1)
                        });
                    });
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