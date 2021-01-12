import { ILogging } from "../../book/Logging";
import { Collections } from "../../entity/Collections";
import { buildResponse, Service, buildErrorResponse } from "../../entity/Service";
import admin = require('firebase-admin');
import { Errors } from "../../entity/Errors";

export const userDelete = (logging: ILogging): Service<UserDeleteRequest, {}> => req => {
    if (!req.username) {
        return buildErrorResponse(Errors.INVALID_LOGIN_TOKEN_DELETE_REQUEST);
    }

    logging.info("userDelete", "Starts");

    const db = admin.firestore();

    return db.collection(Collections.USER).doc(req.username).delete().then(_ => buildResponse({}));
};

export interface UserDeleteRequest {
    username: string
}