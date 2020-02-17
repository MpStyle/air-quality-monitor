import { ILogging } from "../../book/Logging";
import { StringUtils } from "../../book/StringUtils";
import { Collections } from "../../entity/Collections";
import { Errors } from "../../entity/Errors";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import { TimeRangeReading } from "../../entity/TimeRangeReading";
import { timeRangeReadingById } from "./TimeRangeReadingById";
import admin = require('firebase-admin');

export const timeRangeReadingUpsert = (logging: ILogging): Service<TimeRangeReadingUpsertRequest, TimeRangeReadingUpsertResponse> => req => {
    if (!req.timeRangeReading
        || StringUtils.isNullOrEmpty(req.timeRangeReading.deviceId)
        || StringUtils.isNullOrEmpty(req.timeRangeReading.timeRange)
        || StringUtils.isNullOrEmpty(req.timeRangeReading.type)
        || req.timeRangeReading.counter === null || req.timeRangeReading.counter === undefined
        || req.timeRangeReading.granularity === null || req.timeRangeReading.granularity === undefined
        || req.timeRangeReading.value === null || req.timeRangeReading.value === undefined
    ) {
        return buildErrorResponse(Errors.INVALID_LOGIN_TOKEN_ADD_REQUEST);
    }

    logging.info("timeRangeReadingUpsert", "Starts");

    const timeRangeReadingToAdd: TimeRangeReading = {
        ...req.timeRangeReading
    };
    const id = `${req.timeRangeReading.timeRange}_${req.timeRangeReading.type}_${req.timeRangeReading.deviceId}`;
    const db = admin.firestore();
    const docRef = db.collection(Collections.TIME_RANGE_READING).doc(id);

    return docRef
        .set(timeRangeReadingToAdd)
        .then(result => {
            if (!result.writeTime) {
                return buildErrorResponse(Errors.ERROR_WHILE_ADD_TIME_RANGE_READING);
            }

            return timeRangeReadingById(logging)({ timeRangeReadingId: id })
                .then(response => {
                    if (response.error) {
                        logging.error("timeRangeReadingUpsert", `Error 01: ${response.error}`);
                        return buildErrorResponse(response.error);
                    }

                    return buildResponse<TimeRangeReadingUpsertResponse>({ timeRangeReading: response.payload?.timeRangeReading });
                });
        })
        .catch(err => {
            logging.error("timeRangeReadingUpsert", `Error while adding time range reading: ${err}`);
            return buildErrorResponse(err);
        });
}

export interface TimeRangeReadingUpsertRequest {
    timeRangeReading: TimeRangeReading;
}

export interface TimeRangeReadingUpsertResponse {
    timeRangeReading?: TimeRangeReading;
}