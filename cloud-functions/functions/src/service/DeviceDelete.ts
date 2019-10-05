import { ServiceAsync } from "../entity/Service";
import { ServiceResponse } from "../entity/ServiceResponse";
import { Errors } from "../entity/Errors";
import admin = require('firebase-admin');
import functions = require('firebase-functions');
import { Collections } from "../entity/Collections";
import { deviceSearch, DeviceSearchRequest } from "./DeviceSearch";

export const deviceDelete: ServiceAsync<DeviceDeleteRequest, boolean> = (req: DeviceDeleteRequest): Promise<DeviceDeleteResponse> => {
    if (!req.googleEmail || req.googleEmail === ''
        || !req.googleToken || req.googleToken === '') {
        return Promise.resolve(<DeviceDeleteResponse>{ error: Errors.INVALID_DEVICE_SEARCH_REQUEST });
    }

    return deviceSearch(<DeviceSearchRequest>{
        deviceId: req.deviceId,
        googleEmail: req.googleEmail,
        googleToken: req.googleToken,
    })
        .then(deviceSearchResponse => {
            if (deviceSearchResponse.error) {
                return Promise.resolve(<DeviceDeleteResponse>{ error: deviceSearchResponse.error });
            }

            if (deviceSearchResponse.payload && deviceSearchResponse.payload.length) {
                admin.initializeApp(functions.config().firebase);
                const db = admin.firestore();

                return db
                    .collection(Collections.DEVICE)
                    .doc(req.deviceId)
                    .delete()
                    .then(result => <DeviceDeleteResponse>{ payload: !!result.writeTime })
                    .catch((err: any) => Promise.resolve({ error: err }));
            }

            return Promise.resolve(<DeviceDeleteResponse>{ error: Errors.DEVICE_NOT_FOUND });
        })
        .catch((err: any) => Promise.resolve({ error: err }));
}

export interface DeviceDeleteRequest {
    deviceId: string;
    googleEmail: string;
    googleToken: string;
}

export interface DeviceDeleteResponse extends ServiceResponse<boolean> { }