import { ILogging } from "../../book/Logging";
import { Collections } from "../../entity/Collections";
import { Device } from "../../entity/Device";
import { Errors } from "../../entity/Errors";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import { deviceById, DeviceByIdRequest } from "./DeviceById";
import admin = require('firebase-admin');
import uuid = require("uuid");

export const deviceUpsert = (logging: ILogging): Service<DeviceUpsertRequest, DeviceUpsertResponse> => req => {
    if (!req.device
        || !req.device.name || req.device.name === '') {
        return buildErrorResponse(Errors.INVALID_DEVICE_ADD_REQUEST);
    }

    logging.info("deviceUpsert", "Starts");

    const deviceToAdd: Device = {
        ...req.device,
        deviceId: req.device.deviceId ?? uuid.v4(),
        enabled: req.device.enabled ?? true
    };
    const db = admin.firestore();
    const docRef = db.collection(Collections.DEVICE).doc(deviceToAdd.deviceId);

    return docRef
        .set(deviceToAdd)
        .then(result => {
            logging.debug("deviceUpsert", `Add device result: ${JSON.stringify(result.writeTime)}`);
            if (!result.writeTime) {
                return buildErrorResponse(Errors.ERROR_WHILE_ADD_DEVICE);
            }

            return deviceById(logging)(<DeviceByIdRequest>{ deviceId: deviceToAdd.deviceId })
                .then(response => {
                    if (response.error) {
                        logging.error("deviceUpsert", `Error 01: ${response.error}`);
                        return buildErrorResponse(response.error);
                    }

                    return buildResponse({ device: response.payload?.device });
                });
        })
        .catch((err: any) => {
            logging.error("deviceUpsert", `Error while adding device: ${err}`);
            return buildErrorResponse(err);
        });
};

export interface DeviceUpsertRequest {
    device: Device;
}

export interface DeviceUpsertResponse {
    device?: Device;
}