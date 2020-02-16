import { ILogging } from "../../book/Logging";
import { Collections } from "../../entity/Collections";
import { Errors } from "../../entity/Errors";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import { TimeRangeReading } from "../../entity/TimeRangeReading";
import admin = require('firebase-admin');

export const timeRangeReadingById = (logging: ILogging): Service<TimeRangeReadingByIdRequest, TimeRangeReadingByIdResponse> => req => {
    if (!req.timeRangeReadingId || req.timeRangeReadingId === '') {
        return buildErrorResponse(Errors.INVALID_TIME_RANGE_READING_BY_ID_REQUEST);
    }

    logging.info("timeRangeReadingById", "Starts");

    const db = admin.firestore();
    const collectionRef = db.collection(Collections.TIME_RANGE_READING).doc(req.timeRangeReadingId);

    return collectionRef.get()
        .then(snapshot => {
            if (!snapshot) {
                logging.debug("timeRangeReadingById", "No time range reading found");
                return buildResponse<TimeRangeReadingByIdResponse>({ timeRangeReading: undefined });
            }

            return buildResponse<TimeRangeReadingByIdResponse>({ timeRangeReading: snapshot.data() as TimeRangeReading });
        })
        .catch((err: any) => {
            logging.error("timeRangeReadingById", `Error while searching time range reading: ${err}`);
            return buildErrorResponse(err);
        });
};

export interface TimeRangeReadingByIdRequest {
    timeRangeReadingId: string;
}

export interface TimeRangeReadingByIdResponse {
    timeRangeReading?: TimeRangeReading;
}