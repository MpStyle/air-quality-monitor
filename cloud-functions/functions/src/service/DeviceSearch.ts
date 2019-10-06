import { Collections } from "../entity/Collections";
import { Device } from "../entity/Device";
import { Errors } from "../entity/Errors";
import { ServiceAsync } from "../entity/Service";
import { ServiceResponse } from "../entity/ServiceResponse";
import admin = require('firebase-admin');
import functions = require('firebase-functions');

export const deviceSearch: ServiceAsync<DeviceSearchRequest, Device[]> = (req: DeviceSearchRequest): Promise<DeviceSearchResponse> => {
    admin.initializeApp(functions.config().firebase);

    const db = admin.firestore();
    const collectionRef = db.collection(Collections.DEVICE);

    if (req.deviceId) {
        collectionRef.where('deviceId', '==', req.deviceId);
    }

    return collectionRef.get()
        .then(snapshots => {
            if (!snapshots || snapshots.docs.length === 0) {
                return Promise.resolve(<DeviceSearchResponse>{ error: Errors.DEVICE_NOT_FOUND });
            }

            return Promise.resolve({
                payload: snapshots.docs.map(snapshot => <Device>snapshot.data())
            });
        })
        .catch((err: any) => Promise.resolve({ error: err }));
};

export interface DeviceSearchRequest {
    deviceId: string;
}

export interface DeviceSearchResponse extends ServiceResponse<Device[]> {
}