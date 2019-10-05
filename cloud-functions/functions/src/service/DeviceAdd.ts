import { Collections } from "../entity/Collections";
import { Device } from "../entity/Device";
import { Errors } from "../entity/Errors";
import { ServiceAsync } from "../entity/Service";
import { ServiceResponse } from "../entity/ServiceResponse";
import { deviceSearch, DeviceSearchRequest, DeviceSearchResponse } from "./DeviceSearch";
import uuid = require("uuid");
import admin = require('firebase-admin');
import functions = require('firebase-functions');

export const deviceAdd: ServiceAsync<DeviceAddRequest, Device> = (req: DeviceAddRequest): Promise<DeviceAddResponse> => {
    if (!req.googleEmail || req.googleEmail === ''
        || !req.googleToken || req.googleToken === ''
        || !req.deviceName || req.deviceName === '') {
        return Promise.resolve(<DeviceAddResponse>{ error: Errors.INVALID_DEVICE_ADD_REQUEST });
    }

    admin.initializeApp(functions.config().firebase);

    const db = admin.firestore();
    const deviceId = uuid.v4();
    const deviceToken = uuid.v4();
    const docRef = db.collection(Collections.DEVICE).doc(deviceId);

    return docRef
        .set(<Device>{
            deviceId: deviceId,
            name: req.deviceName,
            googleEmail: req.googleEmail,
            deleted: false,
            inserted: (new Date).getTime(),
            tokens: [deviceToken],
            tokenDueDate: 0
        })
        .then(result => {
            if (!result.writeTime) {
                return Promise.resolve({ error: Errors.ERROR_WHILE_ADD_DEVICE });
            }

            return deviceSearch(<DeviceSearchRequest>{ deviceId: deviceId })
                .then((response: DeviceSearchResponse) => {
                    if (response.error) {
                        return Promise.resolve(<DeviceAddResponse>{ error: response.error });
                    }

                    if (!response.payload || (response.payload && response.payload.length !== 1)) {
                        return Promise.resolve(<DeviceAddResponse>{ error: Errors.DEVICE_NOT_FOUND });
                    }

                    return Promise.resolve(<DeviceAddResponse>{ device: response.payload[0] });
                });
        })
        .catch((err: any) => {
            return Promise.resolve({ error: err });
        });
};

export interface DeviceAddRequest {
    googleEmail: string;
    googleToken: string;
    deviceName: string;
}

export interface DeviceAddResponse extends ServiceResponse<Device> {
}