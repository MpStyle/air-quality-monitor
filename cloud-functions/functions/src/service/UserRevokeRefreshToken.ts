import { Service, buildErrorResponse, buildResponse } from "../entity/Service";
import { ILogging } from "../book/Logging";
import { Collections } from "../entity/Collections";
import admin = require('firebase-admin');
import { Errors } from "../entity/Errors";

export const userRevokeRefreshToken = (logging: ILogging): Service<UserRevokeRefreshTokenRequest, {}> => req => {
    if (!req.refreshToken) {
        return buildErrorResponse(Errors.INVALID_USER_REVOKE_REFRESH_TOKEN_REQUEST);
    }

    const db = admin.firestore();
    return db
        .collection(Collections.LOGIN_TOKEN)
        .doc(req.refreshToken)
        .delete()
        .then(_ => {
            return buildResponse({});
        })
        .catch(err => {
            logging.error("userRevokeRefreshToken", `Error while revoke refresh token: ${err}`);
            return buildErrorResponse(err);
        });
}

export interface UserRevokeRefreshTokenRequest {
    refreshToken: string;
}