import { ILogging } from "../../book/Logging";
import { StringUtils } from "../../book/StringUtils";
import { Collections } from "../../entity/Collections";
import { Errors } from "../../entity/Errors";
import { Reading } from "../../entity/Reading";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import { readingById } from "./ReadingById";
import admin = require('firebase-admin');
import uuid = require("uuid");

export const readingUpsert = (logging: ILogging): Service<ReadingUpsertRequest, ReadingUpsertResponse> => req => {
    if (!req.reading
        || !StringUtils.isNullOrEmpty(req.reading.deviceId)
        || !StringUtils.isNullOrEmpty(req.reading.type)
        || !req.reading.value) {
        return buildErrorResponse(Errors.INVALID_READING_UPSERT_REQUEST);
    }

    logging.info("readingUpsert", "Starts");

    const readingToAdd: Reading = {
        ...req.reading,
        readingId: req.reading.readingId ?? uuid.v4(),
        inserted: req.reading.inserted ?? Date.now(),
        updated: req.reading.updated ?? Date.now()
    };
    const db = admin.firestore();
    const docRef = db.collection(Collections.READING).doc(readingToAdd.readingId);

    return docRef
        .set(readingToAdd)
        .then(result => {
            if (!result.writeTime) {
                return buildErrorResponse(Errors.ERROR_WHILE_UPSERT_READING);
            }

            return readingById(logging)({ readingId: readingToAdd.readingId })
                .then(response => {
                    if (response.error) {
                        logging.error("readingUpsert", `Error 01: ${response.error}`);
                        return buildErrorResponse(response.error);
                    }

                    return buildResponse<ReadingUpsertResponse>({ reading: response.payload?.reading });
                });
        })
        .catch((err: any) => {
            logging.error("readingUpsert", `Error while adding reading: ${err}`);
            return buildErrorResponse(err);
        });
};

export interface ReadingUpsertRequest {
    reading: Reading;
}

export interface ReadingUpsertResponse {
    reading?: Reading;
}