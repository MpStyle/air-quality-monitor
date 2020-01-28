import { ILogging } from "../../book/Logging";
import { Collections } from "../../entity/Collections";
import { Errors } from "../../entity/Errors";
import { Reading } from "../../entity/Reading";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import { TimeRangeReading } from '../../entity/TimeRangeReading';
import { devicesSearch, DevicesSearchRequest } from "./DevicesSearch";
import { TimeRangeReadingSearchRequest, timeRangeReadingsSearch } from './TimeRangeReadingsSearch';
import admin = require('firebase-admin');
import { Granularity } from "../../entity/Granularity";

export const timeRangeReadingAdd = (logging: ILogging): Service<TimeRangeReadingAddRequest, TimeRangeReadingAddResponse> => req => {
    if (!req.deviceId || req.deviceId === ''
        || !req.type || req.type === ''
        || req.value === null || req.value === undefined
        || !req.timeRange || req.timeRange === ''
        || req.granularity === null || req.granularity === undefined
    ) {
        return buildErrorResponse(Errors.INVALID_READING_ADD_REQUEST);
    }

    logging.info("timeRangeReadingAdd", "Starts");

    const db = admin.firestore();
    const deviceSearchService = devicesSearch(logging);
    const timeRangeReadingsSearchService = timeRangeReadingsSearch(logging);

    return deviceSearchService(<DevicesSearchRequest>{ deviceId: req.deviceId })
        .then(deviceSearchResponse => {
            if (deviceSearchResponse.error) {
                return buildErrorResponse(deviceSearchResponse.error);
            }

            if (!deviceSearchResponse.payload || !deviceSearchResponse.payload.devices || !deviceSearchResponse.payload.devices.length) {
                return buildErrorResponse(Errors.DEVICE_NOT_FOUND);
            }

            return timeRangeReadingsSearchService(<TimeRangeReadingSearchRequest>{
                timeRange: req.timeRange,
                deviceId: req.deviceId,
                type: req.type
            })
                .then(response => {
                    if (response.error) {
                        return buildErrorResponse(response.error);
                    }

                    if (!response.payload || !response.payload.timeRangeReadings) {
                        return buildErrorResponse(Errors.TIME_RANGE_READING_NOT_FOUND);
                    }

                    let reading = response.payload.timeRangeReadings[0] ?? <TimeRangeReading>{
                        counter: 0,
                        deviceId: req.deviceId,
                        timeRange: req.timeRange,
                        type: req.type,
                        value: 0,
                        granularity: req.granularity
                    };
                    reading = { ...reading, value: reading.value + req.value, counter: reading.counter + 1 };

                    const docRef = db.collection(Collections.TIME_RANGE_READING).doc(`${req.timeRange}_${req.type}_${req.deviceId}`);
                    return docRef
                        .set(reading)
                        .then(result => {
                            if (!result.writeTime) {
                                return buildErrorResponse(Errors.ERROR_WHILE_ADD_TIME_RANGE_READING);
                            }

                            return timeRangeReadingsSearchService({
                                timeRange: req.timeRange
                            })
                                .then(readingSearchResponse => {
                                    if (readingSearchResponse.error) {
                                        return buildErrorResponse(readingSearchResponse.error);
                                    }

                                    if (!readingSearchResponse.payload || !readingSearchResponse.payload.timeRangeReadings || readingSearchResponse.payload.timeRangeReadings.length !== 1) {
                                        return buildErrorResponse(Errors.TIME_RANGE_READING_NOT_FOUND);
                                    }

                                    return buildResponse({ readings: readingSearchResponse.payload.timeRangeReadings });
                                });
                        })
                        .catch((err: any) => {
                            logging.error("timeRangeReadingAdd", `Error while adding time range reading (${req.timeRange}-${req.type}-${req.deviceId}): ${err}]`);
                            return Promise.resolve({ error: err });
                        });
                });
        })
        .catch((err: any) => {
            logging.error("timeRangeReadingAdd", `Error while adding time range reading: ${err}`);
            return Promise.resolve({ error: err });
        });
};

export interface TimeRangeReadingAddRequest {
    deviceId: string,
    type: string,
    value: number,
    timeRange: string
    granularity: Granularity
}

export interface TimeRangeReadingAddResponse {
    readings: Reading[];
}