import { Collections } from "../entity/Collections";
import { Device } from "../entity/Device";
import { Errors } from "../entity/Errors";
import { ServiceAsync } from "../entity/Service";
import { ServiceResponse } from "../entity/ServiceResponse";
import { deviceSearch, DeviceSearchRequest, DeviceSearchResponse } from "./DeviceSearch";
import admin = require('firebase-admin');
import functions = require('firebase-functions');

export const deviceAdd: ServiceAsync<DeviceAddRequest, Device> = (req: DeviceAddRequest): Promise<DeviceAddResponse> => {
    if (!req.deviceId || req.deviceId === ''
        || !req.deviceName || req.deviceName === '') {
        return Promise.resolve(<DeviceAddResponse>{ error: Errors.INVALID_DEVICE_ADD_REQUEST });
    }

    admin.initializeApp(functions.config().firebase);

    const db = admin.firestore();
    const docRef = db.collection(Collections.DEVICE).doc(req.deviceId);

    return deviceSearch({ deviceId: req.deviceId })
        .then(deviceSearchResponse => {
            if (deviceSearchResponse.error) {
                return Promise.resolve(<DeviceAddResponse>{ error: deviceSearchResponse.error });
            }

            const device = <Device>{
                deviceId: req.deviceId,
                name: req.deviceName,
                address: req.deviceAddress,
                inserted: (new Date).getTime(),
            };

            if (deviceSearchResponse.payload && deviceSearchResponse.payload.length) {
                device.inserted = deviceSearchResponse.payload[0].inserted;
            }

            return docRef
                .set(device)
                .then(result => {
                    if (!result.writeTime) {
                        return Promise.resolve({ error: Errors.ERROR_WHILE_ADD_DEVICE });
                    }

                    return deviceSearch(<DeviceSearchRequest>{ deviceId: req.deviceId })
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
        });
};

export interface DeviceAddRequest {
    deviceId: string;
    deviceName: string;
    deviceAddress: string;
}

export interface DeviceAddResponse extends ServiceResponse<Device> {
}