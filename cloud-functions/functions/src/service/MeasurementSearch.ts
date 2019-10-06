import { Collections } from "../entity/Collections";
import { Measurement } from "../entity/Measurement";
import { Errors } from "../entity/Errors";
import { ServiceAsync } from "../entity/Service";
import { ServiceResponse } from "../entity/ServiceResponse";
import admin = require('firebase-admin');
import functions = require('firebase-functions');

export const measurementSearch: ServiceAsync<MeasurementSearchRequest, Measurement[]> = (req: MeasurementSearchRequest): Promise<MeasurementSearchResponse> => {
    admin.initializeApp(functions.config().firebase);

    const db = admin.firestore();
    const collectionRef = db.collection(Collections.MEASUREMENT);

    if (req.measurementId) {
        collectionRef.where('measurementId', '==', req.measurementId);
    }

    return collectionRef.get()
        .then(snapshots => {
            if (!snapshots || snapshots.docs.length === 0) {
                return Promise.resolve(<MeasurementSearchResponse>{ error: Errors.MEASUREMENT_NOT_FOUND });
            }

            return Promise.resolve({
                payload: snapshots.docs.map(snapshot => <Measurement>snapshot.data())
            });
        })
        .catch((err: any) => Promise.resolve({ error: err }));
};

export interface MeasurementSearchRequest {
    measurementId: string;
}

export interface MeasurementSearchResponse extends ServiceResponse<Measurement[]> {
}