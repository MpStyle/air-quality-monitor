import { ILogging } from "../../book/Logging";
import { StringUtils } from "../../book/StringUtils";
import { Collections } from "../../entity/Collections";
import { Errors } from "../../entity/Errors";
import { LoginToken } from "../../entity/LoginToken";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import { loginTokenById } from "./LoginTokenById";
import admin = require('firebase-admin');
import uuid = require("uuid");

export const loginTokenUpsert = (logging: ILogging): Service<LoginTokenUpsertRequest, LoginTokenUpsertResponse> => req => {
    if (!req.loginToken
        || StringUtils.isNullOrEmpty(req.loginToken.username)) {
        return buildErrorResponse(Errors.INVALID_LOGIN_TOKEN_ADD_REQUEST);
    }

    logging.info("loginTokenUpsert", "Starts");

    const loginTokenToAdd: LoginToken = {
        ...req.loginToken,
        expiredAt: req.loginToken.expiredAt ?? Date.now() + 5 * 60 * 1000, // 5 minutes
        refreshToken: req.loginToken.refreshToken ?? uuid.v4(),
        accessToken: req.loginToken.accessToken ?? uuid.v4(),
        enabled: req.loginToken.enabled ?? true,
        inserted: req.loginToken.inserted ?? Date.now(),
        updated: req.loginToken.updated ?? Date.now()
    };
    const db = admin.firestore();
    const docRef = db.collection(Collections.LOGIN_TOKEN).doc(loginTokenToAdd.refreshToken);

    return docRef
        .set(loginTokenToAdd)
        .then(result => {
            if (!result.writeTime) {
                return buildErrorResponse(Errors.ERROR_WHILE_ADD_DEVICE);
            }

            return loginTokenById(logging)({ refreshToken: loginTokenToAdd.refreshToken })
                .then(response => {
                    if (response.error) {
                        logging.error("loginTokenUpsert", `Error 01: ${response.error}`);
                        return buildErrorResponse(response.error);
                    }

                    return buildResponse<LoginTokenUpsertResponse>({ loginToken: response.payload?.loginToken });
                });
        })
        .catch(err => {
            logging.error("loginTokenUpsert", `Error while adding login token: ${err}`);
            return buildErrorResponse(err);
        });
}

export interface LoginTokenUpsertRequest {
    loginToken: LoginToken;
}

export interface LoginTokenUpsertResponse {
    loginToken?: LoginToken;
}