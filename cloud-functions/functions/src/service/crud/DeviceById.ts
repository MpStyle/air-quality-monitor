import { ILogging } from "../../book/Logging";
import { Collections } from "../../entity/Collections";
import { Device } from "../../entity/Device";
import { Errors } from "../../entity/Errors";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import admin = require('firebase-admin');

export const deviceById = (logging: ILogging): Service<DeviceByIdRequest, DeviceByIdResponse> => req => {
    if (!req.deviceId || req.deviceId === '') {
        return buildErrorResponse(Errors.INVALID_DEVICE_BY_ID_REQUEST);
    }

    logging.info("deviceById", "Starts");

    const db = admin.firestore();
    const collectionRef = db.collection(Collections.DEVICE).doc(req.deviceId);

    return collectionRef.get()
        .then(snapshot => {
            if (!snapshot) {
                logging.debug("deviceById", "No device found");
                return buildResponse<DeviceByIdResponse>({ device: undefined });
            }

            return buildResponse<DeviceByIdResponse>({ device: snapshot.data() as Device });
        })
        .catch((err: any) => {
            logging.error("deviceById", `Error while searching device: ${err}`);
            return buildErrorResponse(err);
        });
};

export interface DeviceByIdRequest {
    deviceId: string;
}

export interface DeviceByIdResponse {
    device?: Device;
}