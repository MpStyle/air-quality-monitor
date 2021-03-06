import { ILogging } from "../../book/Logging";
import { Device } from "../../entity/Device";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import { deviceUpsert } from "../crud/DeviceUpsert";
import uuid = require("uuid");
import { Errors } from "../../entity/Errors";
import { userAuthorization } from "./UserAuthorization";

export const userDeviceAdd = (logging: ILogging): Service<UserDeviceAddRequest, UserDeviceAddResponse> => req => {
    logging.info("userDeviceDelete", "Starts");

    return userAuthorization(logging)({ accessToken: req.accessToken })
        .then(authorizationResponse => {
            if (authorizationResponse.error) {
                return buildErrorResponse(authorizationResponse.error);
            }

            if (!authorizationResponse.payload) {
                return buildErrorResponse(Errors.USER_UNAUTHORIZED);
            }

            const deviceUpsertService = deviceUpsert(logging);
            const device = {
                deviceId: uuid.v4(),
                enabled: true,
                name: req.name,
                scope: req.scope,
                secretKey: req.secretKey,
                address: req.address,
                inserted: Date.now(),
                updated: Date.now(),
            } as Device;

            return deviceUpsertService({ device })
                .then(deviceUpsertResponse => {
                    if (deviceUpsertResponse.error) {
                        return buildErrorResponse(deviceUpsertResponse.error);
                    }

                    if (!deviceUpsertResponse.payload || !deviceUpsertResponse.payload.device) {
                        return buildErrorResponse(Errors.ERROR_WHILE_ADD_DEVICE);
                    }

                    return buildResponse({ device: deviceUpsertResponse.payload.device });
                });
        })
        .catch((error: any) => {
            logging.error("userDeviceAdd", `Error while add device: ${JSON.stringify(error)}`);
            return buildErrorResponse(Errors.ERROR_WHILE_ADD_DEVICE);
        });
};

export interface UserDeviceAddRequest {
    accessToken: string;
    address?: string;
    name: string;
    scope: string;
    secretKey: string;
}

export interface UserDeviceAddResponse {
    device: Device;
}