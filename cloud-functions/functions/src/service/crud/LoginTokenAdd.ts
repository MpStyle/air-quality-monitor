import { ILogging } from "../../book/Logging";
import { Service, buildErrorResponse, buildResponse } from "../../entity/Service";
import { LoginToken } from "../../entity/LoginToken";
import { Errors } from "../../entity/Errors";
import { StringUtils } from "../../book/StringUtils";
import admin = require('firebase-admin');
import { Collections } from "../../entity/Collections";

export const loginTokenAdd = (logging: ILogging): Service<LoginTokenRequest, LoginTokenResponse> => req => {
    if (!req.username) {
        return buildErrorResponse(Errors.INVALID_LOGIN_TOKEN_ADD_REQUEST);
    }

    logging.info("loginTokenAdd", "Starts");

    const userLoginData = {
        accessToken: req.accessToken ?? StringUtils.randomString(),
        refreshToken: req.refreshToken ?? StringUtils.randomString(),
        expiredAt: req.expiredAt ?? Date.now() + 300000, // 5 minutes
        username: req.username,
        enabled: req.enabled ?? true,
        updated: Date.now()
    } as LoginToken;

    const db = admin.firestore();
    const docRef = db.collection(Collections.LOGIN_TOKEN).doc(userLoginData.refreshToken);

    return docRef
        .set(userLoginData)
        .then(result => {
            if (!result.writeTime) {
                return buildErrorResponse(Errors.ERROR_WHILE_ADD_DEVICE);
            }

            return buildResponse<LoginTokenResponse>({ loginToken: userLoginData });
        })
        .catch(err => {
            logging.error("userLogin", `Error while login: ${err}`);
            return buildErrorResponse(err);
        });
}

export interface LoginTokenRequest {
    accessToken?: string;
    expiredAt?: number;
    refreshToken?: string;
    username?: string;
    enabled?: boolean;
}

export interface LoginTokenResponse {
    loginToken: LoginToken;
}