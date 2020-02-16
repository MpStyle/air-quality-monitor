import { ILogging } from "../../book/Logging";
import { Collections } from "../../entity/Collections";
import { Errors } from "../../entity/Errors";
import { Reading } from "../../entity/Reading";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import admin = require('firebase-admin');

export const readingById = (logging: ILogging): Service<ReadingByIdRequest, ReadingByIdResponse> => req => {
    if (!req.readingId || req.readingId === '') {
        return buildErrorResponse(Errors.INVALID_READING_BY_ID_REQUEST);
    }

    logging.info("readingById", "Starts");

    const db = admin.firestore();
    const collectionRef = db.collection(Collections.READING).doc(req.readingId);

    return collectionRef.get()
        .then(snapshot => {
            if (!snapshot) {
                logging.debug("readingById", "No reading found");
                return buildResponse<ReadingByIdResponse>({ reading: undefined });
            }

            return buildResponse<ReadingByIdResponse>({ reading: snapshot.data() as Reading });
        })
        .catch((err: any) => {
            logging.error("readingById", `Error while searching reading: ${err}`);
            return buildErrorResponse(err);
        });
};

export interface ReadingByIdRequest {
    readingId: string;
}

export interface ReadingByIdResponse {
    reading?: Reading;
}