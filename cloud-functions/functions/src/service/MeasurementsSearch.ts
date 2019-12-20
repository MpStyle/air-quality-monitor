import { ILogging } from "../book/Logging";
import { Collections } from "../entity/Collections";
import { Measurement } from "../entity/Measurement";
import { PagedRequest } from "../entity/PagedRequest";
import { buildErrorResponse, buildResponse, Service } from "../entity/Service";
import admin = require('firebase-admin');

export const measurementsSearch = (logging: ILogging): Service<MeasurementSearchRequest, MeasurementSearchResponse> => req => {
    logging.info("measurementsSearch", "Starts");

    const db = admin.firestore();
    let collectionRef: FirebaseFirestore.CollectionReference | FirebaseFirestore.Query = db.collection(Collections.MEASUREMENT);

    collectionRef = collectionRef.where('inserted', '>', 0);

    if (req.measurementId) {
        collectionRef = collectionRef.where('measurementId', '==', req.measurementId);
    }

    if (req.deviceId) {
        collectionRef = collectionRef.where('deviceId', '==', req.deviceId);
    }

    if (req.type) {
        collectionRef = collectionRef.where('type', '==', req.type);
    }

    if (req.offset) {
        collectionRef = collectionRef.startAfter(req.offset);
    }

    if (req.limit) {
        collectionRef = collectionRef.limit(req.limit);
    }

    collectionRef = collectionRef.orderBy("inserted", "desc");

    return collectionRef.get()
        .then(snapshots => {
            if (!snapshots || snapshots.docs.length === 0) {
                logging.debug("measurementsSearch", "No measurement found");
                return buildResponse<MeasurementSearchResponse>({ measurements: [] });
            }

            return buildResponse<MeasurementSearchResponse>({ measurements: snapshots.docs.map(snapshot => <Measurement>snapshot.data()) });
        })
        .catch((err: any) => {
            logging.error("measurementsSearch", `Error while searching measurements: ${err}`);
            return buildErrorResponse(err);
        });
};

export interface MeasurementSearchRequest extends PagedRequest {
    measurementId?: string;
    deviceId?: string;
    type?: string;
}

export interface MeasurementSearchResponse {
    measurements: Measurement[];
}