import { ILogging } from "../book/Logging";
import { Errors } from "../entity/Errors";
import { buildErrorResponse, buildResponse, Service } from "../entity/Service";
import { readingDelete } from "../service/crud/ReadingDelete";
import { readingsSearch } from "../service/crud/ReadingsSearch";
import Bluebird = require("bluebird");

export const deleteOldReadings = (logging: ILogging): Service<DeleteOldReadingsRequest, {}> => req => {
    logging.info("deleteOldReadings", "Starts");

    const insertedBefore = req.lastInserted - (24 * 60 * 60 * 1000); // 1 day

    logging.info("deleteOldReadings", `insertedBefore: ${insertedBefore}`);

    return readingsSearch(logging)({ insertedBefore: insertedBefore })
        .then(response => {
            if (response.error) {
                logging.error("deleteOldReadings", `readingsSearch - ${response.error}`);
                return buildErrorResponse(response.error);
            }

            if (!response.payload || !response.payload.readings) {
                logging.error("deleteOldReadings", `readingsSearch`);
                return buildErrorResponse(Errors.ERROR_WHILE_SEARCH_READING);
            }

            return Bluebird.map(response.payload.readings, (reading) => {
                logging.info("deleteOldReadings", `Removing reading ${reading.readingId}...`);
                return readingDelete(logging)({ readingId: reading.readingId });
            }, { concurrency: 5 })
                .then(_ => buildResponse({}));
        })
        .catch(err => {
            logging.error("deleteOldReadings", `Error while deleting old readings: ${err}`);
            return buildErrorResponse(err);
        });
};

interface DeleteOldReadingsRequest {
    lastInserted: number;
}