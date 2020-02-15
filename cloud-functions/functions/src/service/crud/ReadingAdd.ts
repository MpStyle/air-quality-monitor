import { ILogging } from "../../book/Logging";
import { Collections } from "../../entity/Collections";
import { Errors } from "../../entity/Errors";
import { Reading } from "../../entity/Reading";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import { readingsSearch } from "./ReadingsSearch";
import admin = require('firebase-admin');
import uuid = require("uuid");

export const readingAdd = (logging: ILogging): Service<ReadingAddRequest, ReadingAddResponse> => async req => {
    if (!req.deviceId || req.deviceId === ''
        || !req.type || req.type === ''
        || !req.value
        || !req.inserted || req.inserted <= 0
    ) {
        return buildErrorResponse(Errors.INVALID_READING_ADD_REQUEST);
    }

    const readingToAdd = {
        deviceId: req.deviceId,
        inserted: req.inserted,
        readingId: req.id ?? uuid.v4(),
        type: req.type,
        value: req.value
    };
    const db = admin.firestore();
    const docRef = db.collection(Collections.READING).doc(readingToAdd.readingId);

    try {
        const result = await docRef.set(readingToAdd);

        if (!result.writeTime) {
            return buildErrorResponse(Errors.ERROR_WHILE_ADD_READING);
        }

        const readingSearchResponse = await readingsSearch(logging)({
            readingId: readingToAdd.readingId,
            deviceId: req.deviceId
        });

        if (readingSearchResponse.error) {
            return buildErrorResponse(readingSearchResponse.error);
        }

        if (!readingSearchResponse.payload || !readingSearchResponse.payload.readings || readingSearchResponse.payload.readings.length !== 1) {
            return buildErrorResponse(Errors.READING_NOT_FOUND);
        }

        return buildResponse<ReadingAddResponse>({ readings: readingSearchResponse.payload.readings });
    }
    catch (error) {
        logging.error("readingAdd", `Error while adding reading: ${error}`);
        return Promise.resolve({ error: error });
    }
};

export interface ReadingAddRequest {
    deviceId: string;
    id?: string;
    type: string;
    value: number;
    inserted: number;
}

export interface ReadingAddResponse {
    readings: Reading[];
}