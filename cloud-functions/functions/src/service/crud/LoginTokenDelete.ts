import { ILogging } from "../../book/Logging";
import { Collections } from "../../entity/Collections";
import { buildResponse, Service, buildErrorResponse } from "../../entity/Service";
import admin = require('firebase-admin');
import { Errors } from "../../entity/Errors";

export const loginTokenDelete = (logging: ILogging): Service<LoginTokenDeleteRequest, {}> => req => {
    if (!req.refreshToken || req.refreshToken === '') {
        return buildErrorResponse(Errors.INVALID_LOGIN_TOKEN_DELETE_REQUEST);
    }

    logging.info("loginTokenDelete", "Starts");

    const db = admin.firestore();

    return db.collection(Collections.LOGIN_TOKEN).doc(req.refreshToken).delete().then(_ => buildResponse({}));
};

export interface LoginTokenDeleteRequest {
    refreshToken: string
}