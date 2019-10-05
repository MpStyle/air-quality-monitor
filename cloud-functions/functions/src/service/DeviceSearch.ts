import { Collections } from "../entity/Collections";
import { Device } from "../entity/Device";
import { Errors } from "../entity/Errors";
import { ServiceAsync } from "../entity/Service";
import { ServiceResponse } from "../entity/ServiceResponse";
import admin = require('firebase-admin');
import functions = require('firebase-functions');

export const deviceSearch: ServiceAsync<DeviceSearchRequest, Device[]> = (req: DeviceSearchRequest): Promise<DeviceSearchResponse> => {
    if (!req.googleEmail || req.googleEmail === ''
        || !req.googleToken || req.googleToken === '') {
        return Promise.resolve(<DeviceSearchResponse>{ error: Errors.INVALID_DEVICE_SEARCH_REQUEST });
    }

    admin.initializeApp(functions.config().firebase);

    const db = admin.firestore();
    const collectionRef = db.collection(Collections.DEVICE);

    collectionRef.where('googleEmail', '==', req.googleEmail);
    collectionRef.where('deleted', '==', false);

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
    googleEmail: string;
    googleToken: string;
}

export interface DeviceSearchResponse extends ServiceResponse<Device[]> {
}