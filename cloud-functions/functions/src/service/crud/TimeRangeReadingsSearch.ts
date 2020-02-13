import { ILogging } from "../../book/Logging";
import { Collections } from "../../entity/Collections";
import { Granularity } from "../../entity/Granularity";
import { PagedRequest } from "../../entity/PagedRequest";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import { TimeRangeReading } from "../../entity/TimeRangeReading";
import admin = require('firebase-admin');

export const timeRangeReadingsSearch = (logging: ILogging): Service<TimeRangeReadingSearchRequest, TimeRangeReadingSearchResponse> => req => {
    logging.info("timeRangeReadingsSearch", "Starts");

    const db = admin.firestore();
    let collectionRef: FirebaseFirestore.CollectionReference | FirebaseFirestore.Query = db.collection(Collections.TIME_RANGE_READING);

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

    if (req.timeRangeGreaterEqualThan) {
        collectionRef = collectionRef.where('timeRange', '>=', req.timeRangeGreaterEqualThan);
    }

    if (req.timeRangeLowerEqualThan) {
        collectionRef = collectionRef.where('timeRange', '<=', req.timeRangeLowerEqualThan);
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
                logging.debug("timeRangeReadingsSearch", "No time range reading found");
                return buildResponse<TimeRangeReadingSearchResponse>({ timeRangeReadings: [] });
            }

            return buildResponse<TimeRangeReadingSearchResponse>({ timeRangeReadings: snapshots.docs.map(snapshot => <TimeRangeReading>snapshot.data()) });
        })
        .catch((err: any) => {
            logging.error("timeRangeReadingsSearch", `Error while searching time range readings: ${err}`);
            return buildErrorResponse(err);
        });
};

export interface TimeRangeReadingSearchRequest extends PagedRequest {
    deviceId?: string;
    type?: string;
    timeRange?: string;
    timeRangeGreaterEqualThan?: string;
    timeRangeLowerEqualThan?: string;
    granularity?: Granularity;
}

export interface TimeRangeReadingSearchResponse {
    timeRangeReadings: TimeRangeReading[];
}