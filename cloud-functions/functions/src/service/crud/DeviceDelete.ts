import { ILogging } from "../../book/Logging";
import { Collections } from "../../entity/Collections";
import { Device } from "../../entity/Device";
import { Errors } from "../../entity/Errors";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import { devicesSearch } from "./DevicesSearch";
import admin = require('firebase-admin');

export const deviceDelete = (logging: ILogging): Service<DeviceDeleteRequest, DeviceDeleteResponse> => req => {
    if (!req.deviceId || req.deviceId === '') {
        return buildErrorResponse(Errors.INVALID_DEVICE_DELETE_REQUEST);
    }

    const db = admin.firestore();
    const deviceSearchService = devicesSearch(logging);

    return deviceSearchService({ deviceId: req.deviceId })
        .then(devicesSearchResponse => {
            if (devicesSearchResponse.error) {
                return buildErrorResponse(devicesSearchResponse.error);
            }

            if (!devicesSearchResponse.payload || !devicesSearchResponse.payload.devices || !devicesSearchResponse.payload.devices.length) {
                return buildErrorResponse(Errors.DEVICE_NOT_FOUND);
            }

            return db.collection(Collections.DEVICE).doc(req.deviceId).delete()
                .then(() => buildResponse({ device: devicesSearchResponse.payload?.devices[0] }));
        })
        .catch(error => {
            logging.error(`deviceDelete","Error while delete device: ${JSON.stringify(error)}`);
            return buildErrorResponse(Errors.ERROR_WHILE_DELETE_DEVICE);
        });
};

export interface DeviceDeleteRequest {
    deviceId: string;
}

export interface DeviceDeleteResponse {
    device: Device;
}