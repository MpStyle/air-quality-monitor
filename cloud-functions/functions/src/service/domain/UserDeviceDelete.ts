import { ILogging } from "../../book/Logging";
import { Device } from "../../entity/Device";
import { Errors } from "../../entity/Errors";
import { buildErrorResponse, Service } from "../../entity/Service";
import { DevicesSearchRequest, DevicesSearchResponse as DevicesSearchResponse } from '../crud/DevicesSearch';
import { userAuthorization } from "./UserAuthorization";
import { deviceAdd } from "../crud/DeviceAdd";

export const userDeviceDelete = (logging: ILogging): Service<UserDeviceDeleteRequest, UserDeviceDeleteResponse> => req => {
    if (!req.accessToken || req.accessToken === '') {
        return buildErrorResponse(Errors.INVALID_USER_DEVICE_SEARCH_REQUEST);
    }

    logging.info("userDeviceDelete", "Starts");

    return userAuthorization(logging)({ accessToken: req.accessToken })
        .then(authorizationResponse => {
            if (authorizationResponse.error) {
                return buildErrorResponse(authorizationResponse.error);
            }

            if (!authorizationResponse.payload) {
                return buildErrorResponse(Errors.USER_UNAUTHORIZED);
            }

            return deviceAdd(logging)({ deviceId: req.deviceId, enabled: false });
        })
        .catch((error: any) => {
            logging.error("userDeviceDelete", `Error while delete device: ${JSON.stringify(error)}`);
            return buildErrorResponse(Errors.ERROR_WHILE_DELETE_DEVICE);
        });
};

export interface UserDeviceDeleteRequest extends DevicesSearchRequest {
    accessToken: string,
    deviceId: string;
}

export interface UserDeviceDeleteResponse extends DevicesSearchResponse {
    device: Device;
}