import { ILogging } from "../book/Logging";
import { StringUtils } from "../book/StringUtils";
import { Errors } from "../entity/Errors";
import { Reading } from "../entity/Reading";
import { buildErrorResponse, buildResponse, Service } from "../entity/Service";
import { timeRangeReadingById } from "../service/crud/TimeRangeReadingById";
import { timeRangeReadingUpsert } from "../service/crud/TimeRangeReadingUpsert";
import Bluebird = require("bluebird");

export const upsertTimeRangeReadings = (logging: ILogging): Service<UpsertTimeRangeReadingsRequest, {}> => req => {
    logging.info("upsertTimeRangeReadings", "Starts");

    const dateObj = new Date(req.reading.inserted);
    const hours = StringUtils.padLeft(dateObj.getUTCHours(), '0', 2);
    const day = StringUtils.padLeft(dateObj.getUTCDate(), '0', 2);
    const month = StringUtils.padLeft(dateObj.getUTCMonth() + 1, '0', 2);
    const year = "" + dateObj.getUTCFullYear();
    const timeRanges = [year + month + day + hours, year + month + day, year + month];

    return Bluebird
        .map(timeRanges, timeRange => {
            const id = `${timeRange}_${req.reading.type}_${req.reading.deviceId}`;
            return timeRangeReadingById(logging)({ timeRangeReadingId: id })
                .then(response => {
                    if (response.error) {
                        return buildErrorResponse(response.error);
                    }

                    if (!response.payload || !response.payload.timeRangeReading) {
                        return buildErrorResponse(Errors.TIME_RANGE_READING_NOT_FOUND);
                    }

                    return timeRangeReadingUpsert(logging)({
                        timeRangeReading: {
                            ...response.payload.timeRangeReading,
                            counter: response.payload.timeRangeReading.counter + 1,
                            value: response.payload.timeRangeReading.value + req.reading.value
                        }
                    });
                })
        }, { concurrency: 5 })
        .then(_ => buildResponse({}))
        .catch(err => {
            logging.error("upsertTimeRangeReadings", `Error while upserting time range readings: ${err}`);
            return buildErrorResponse(err);
        });
}

export interface UpsertTimeRangeReadingsRequest {
    reading: Reading;
}