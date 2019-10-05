import { Collections } from "../entity/Collections";
import { Device } from "../entity/Device";
import { Errors } from "../entity/Errors";
import { ServiceAsync } from "../entity/Service";
import { ServiceResponse } from "../entity/ServiceResponse";
import { deviceSearch, DeviceSearchRequest, DeviceSearchResponse } from "./DeviceSearch";
import admin = require('firebase-admin');
import functions = require('firebase-functions');

export const deviceEdit: ServiceAsync<DeviceEditRequest, Device> = (req: DeviceEditRequest): Promise<DeviceEditResponse> => {
    if (!req.googleEmail || req.googleEmail === ''
        || !req.googleToken || req.googleToken === ''
        || !req.deviceId || req.deviceId === '') {
        return Promise.resolve(<DeviceEditResponse>{ error: Errors.INVALID_DEVICE_EDIT_REQUEST });
    }

    admin.initializeApp(functions.config().firebase);

    const db = admin.firestore();
    const docRef = db.collection(Collections.DEVICE).doc(req.deviceId);

    return docRef
        .set(<Device>{
            deviceId: req.deviceId,
            name: req.deviceName,
            googleEmail: req.googleEmail,
            deleted: false,
            updated: (new Date).getTime()
        }, { merge: true })
        .then(result => {
            if (!result.writeTime) {
                return Promise.resolve({ error: Errors.ERROR_WHILE_EDIT_DEVICE });
            }

            return deviceSearch(<DeviceSearchRequest>{ deviceId: req.deviceId })
                .then((response: DeviceSearchResponse) => {
                    if (response.error) {
                        return Promise.resolve(<DeviceEditResponse>{ error: response.error });
                    }

                    if (!response.payload || (response.payload && response.payload.length !== 1)) {
                        return Promise.resolve(<DeviceEditResponse>{ error: Errors.DEVICE_NOT_FOUND });
                    }

                    return Promise.resolve(<DeviceEditResponse>{ device: response.payload[0] });
                })
                .catch((err: any) => Promise.resolve({ error: err }));
        })
        .catch((err: any) => Promise.resolve({ error: err }));
};

export interface DeviceEditRequest {
    googleEmail: string;
    googleToken: string;
    deviceName: string;
    room: string,
    address: string
    deviceId: string;
}

export interface DeviceEditResponse extends ServiceResponse<Device> {
}