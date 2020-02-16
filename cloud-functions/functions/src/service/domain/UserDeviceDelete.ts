import { ILogging } from "../../book/Logging";
import { StringUtils } from "../../book/StringUtils";
import { Device } from "../../entity/Device";
import { Errors } from "../../entity/Errors";
import { buildErrorResponse, Service } from "../../entity/Service";
import { deviceById } from "../crud/DeviceById";
import { deviceUpsert } from "../crud/DeviceUpsert";
import { userAuthorization } from "./UserAuthorization";

export const userDeviceDelete = (logging: ILogging): Service<UserDeviceDeleteRequest, UserDeviceDeleteResponse> => req => {
    if (StringUtils.isNullOrEmpty(req.accessToken) || StringUtils.isNullOrEmpty(req.deviceId)) {
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

            return deviceById(logging)({ deviceId: req.deviceId })
                .then(response => {
                    if (response.error) {
                        return buildErrorResponse(response.error);
                    }

                    if (!response.payload || !response.payload.device) {
                        return buildErrorResponse(Errors.DEVICE_NOT_FOUND);
                    }

                    return deviceUpsert(logging)({
                        device: {
                            ...response.payload.device,
                            enabled: false
                        }
                    });
                });
        })
        .catch((error: any) => {
            logging.error("userDeviceDelete", `Error while delete device: ${JSON.stringify(error)}`);
            return buildErrorResponse(Errors.ERROR_WHILE_DELETE_DEVICE);
        });
};

export interface UserDeviceDeleteRequest {
    accessToken: string,
    deviceId: string;
}

export interface UserDeviceDeleteResponse {
    device: Device;
}