import { ILogging } from "../../book/Logging";
import { Collections } from "../../entity/Collections";
import { buildResponse, Service, buildErrorResponse } from "../../entity/Service";
import admin = require('firebase-admin');
import { Errors } from "../../entity/Errors";

export const readingDelete = (logging: ILogging): Service<ReadingDeleteRequest, {}> => req => {
    if (!req.readingId || req.readingId === '') {
        return buildErrorResponse(Errors.INVALID_READING_DELETE_REQUEST);
    }

    logging.info("readingDelete", "Starts");

    const db = admin.firestore();

    return db.collection(Collections.LOGIN_TOKEN).doc(req.readingId).delete().then(_ => buildResponse({}));
};

export interface ReadingDeleteRequest {
    readingId: string
}