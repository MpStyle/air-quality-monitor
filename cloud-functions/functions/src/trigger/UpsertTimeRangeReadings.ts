import { ILogging } from "../book/Logging";
import { StringUtils } from "../book/StringUtils";
import { Granularity } from "../entity/Granularity";
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
    const timeRanges = [
        { timeRange: year + month + day + hours, granularity: Granularity.daily },
        { timeRange: year + month + day, granularity: Granularity.monthly },
        { timeRange: year + month, granularity: Granularity.yearly }
    ];

    return Bluebird
        .map(timeRanges, timeRange => {
            const id = `${timeRange.timeRange}_${req.reading.type}_${req.reading.deviceId}`;
            return timeRangeReadingById(logging)({ timeRangeReadingId: id })
                .then(response => {
                    if (response.error) {
                        return buildErrorResponse(response.error);
                    }

                    const timeRangeReading = response.payload?.timeRangeReading || {
                        counter: 0,
                        deviceId: req.reading.deviceId,
                        granularity: timeRange.granularity,
                        timeRange: timeRange.timeRange,
                        type: req.reading.type,
                        value: 0,
                        inserted: Date.now(),
                        updated: Date.now()
                    };

                    return timeRangeReadingUpsert(logging)({
                        timeRangeReading: {
                            ...timeRangeReading,
                            counter: timeRangeReading.counter + 1,
                            value: timeRangeReading.value + req.reading.value,
                            updated: Date.now()
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