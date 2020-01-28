import { ILogging } from "../../book/Logging";
import { Collections } from "../../entity/Collections";
import { Reading } from "../../entity/Reading";
import { PagedRequest } from "../../entity/PagedRequest";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import admin = require('firebase-admin');

export const readingsSearch = (logging: ILogging): Service<ReadingSearchRequest, ReadingSearchResponse> => req => {
    logging.info("readingsSearch", "Starts");

    const db = admin.firestore();
    let collectionRef: FirebaseFirestore.CollectionReference | FirebaseFirestore.Query = db.collection(Collections.READING);

    collectionRef = collectionRef.where('inserted', '>', 0);

    if (req.readingId) {
        collectionRef = collectionRef.where('readingId', '==', req.readingId);
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
                logging.debug("readingsSearch", "No reading found");
                return buildResponse<ReadingSearchResponse>({ readings: [] });
            }

            return buildResponse<ReadingSearchResponse>({ readings: snapshots.docs.map(snapshot => <Reading>snapshot.data()) });
        })
        .catch((err: any) => {
            logging.error("readingsSearch", `Error while searching readings: ${err}`);
            return buildErrorResponse(err);
        });
};

export interface ReadingSearchRequest extends PagedRequest {
    readingId?: string;
    deviceId?: string;
    type?: string;
}

export interface ReadingSearchResponse {
    readings: Reading[];
}