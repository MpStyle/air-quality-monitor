import { ILogging } from "../book/Logging";
import { Collections } from "../entity/Collections";
import { Measurement } from "../entity/Measurement";
import { PagedRequest } from "../entity/PagedRequest";
import { ServiceRequest } from "../entity/ServiceRequest";
import { ServiceResponse } from "../entity/ServiceResponse";
import admin = require('firebase-admin');

export const measurementSearch = (logging: ILogging) => (req: MeasurementSearchRequest): Promise<MeasurementSearchResponse> => {
    logging.info("measurementSearch", "Starts");

    const db = admin.firestore();
    let collectionRef: FirebaseFirestore.CollectionReference | FirebaseFirestore.Query = db.collection(Collections.MEASUREMENT);

    if (req.measurementId) {
        collectionRef = collectionRef.where('measurementId', '==', req.measurementId);
    }

    if (req.deviceId) {
        collectionRef = collectionRef.where('deviceId', '==', req.deviceId);
    }

    if (req.offset) {
        collectionRef = collectionRef.startAfter(req.offset);
    }

    if (req.limit) {
        collectionRef = collectionRef.endAt(req.offset ? req.offset + req.limit : req.limit);
    }

    return collectionRef.get()
        .then(snapshots => {
            if (!snapshots || snapshots.docs.length === 0) {
                logging.debug("measurementSearch", "No measurement found");
                return Promise.resolve(<MeasurementSearchResponse>{ payload: [] });
            }

            return Promise.resolve({
                payload: snapshots.docs.map(snapshot => <Measurement>snapshot.data())
            });
        })
        .catch((err: any) => {
            logging.error("measurementSearch", `Error while searching measurements: ${err}`);
            return Promise.resolve({ error: err });
        });
};

export interface MeasurementSearchRequest extends ServiceRequest, PagedRequest {
    measurementId: string;
    deviceId: string;
}

export interface MeasurementSearchResponse extends ServiceResponse<Measurement[]> {
}