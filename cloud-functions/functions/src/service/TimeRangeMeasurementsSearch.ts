import { ILogging } from "../book/Logging";
import { Collections } from "../entity/Collections";
import { PagedRequest } from "../entity/PagedRequest";
import { buildErrorResponse, buildResponse, Service } from "../entity/Service";
import { TimeRangeMeasurement } from "../entity/TimeRangeMeasurement";
import admin = require('firebase-admin');
import { Granularity } from "../entity/Granularity";

export const timeRangeMeasurementsSearch = (logging: ILogging): Service<TimeRangeMeasurementSearchRequest, TimeRangeMeasurementSearchResponse> => req => {
    logging.info("timeRangeMeasurementsSearch", "Starts");

    const db = admin.firestore();
    let collectionRef: FirebaseFirestore.CollectionReference | FirebaseFirestore.Query = db.collection(Collections.TIME_RANGE_MEASUREMENT);

    if (req.deviceId) {
        collectionRef = collectionRef.where('deviceId', '==', req.deviceId);
    }

    if (req.type) {
        collectionRef = collectionRef.where('type', '==', req.type);
    }

    if (req.granularity) {
        collectionRef = collectionRef.where('granularity', '==', req.granularity);
    }

    if (req.timeRange) {
        collectionRef = collectionRef.where('timeRange', '==', req.timeRange);
    }

    if (req.offset) {
        collectionRef = collectionRef.startAfter(req.offset);
    }

    if (req.limit) {
        collectionRef = collectionRef.limit(req.limit);
    }

    return collectionRef.get()
        .then(snapshots => {
            if (!snapshots || snapshots.docs.length === 0) {
                logging.debug("timeRangeMeasurementsSearch", "No time range measurement found");
                return buildResponse<TimeRangeMeasurementSearchResponse>({ timeRangeMeasurements: [] });
            }

            return buildResponse<TimeRangeMeasurementSearchResponse>({ timeRangeMeasurements: snapshots.docs.map(snapshot => <TimeRangeMeasurement>snapshot.data()) });
        })
        .catch((err: any) => {
            logging.error("timeRangeMeasurementsSearch", `Error while searching time range measurements: ${err}`);
            return buildErrorResponse(err);
        });
};

export interface TimeRangeMeasurementSearchRequest extends PagedRequest {
    deviceId?: string;
    type?: string;
    timeRange?: string;
    granularity?: Granularity;
}

export interface TimeRangeMeasurementSearchResponse {
    timeRangeMeasurements: TimeRangeMeasurement[];
}