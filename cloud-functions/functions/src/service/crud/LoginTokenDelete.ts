import { ILogging } from "../../book/Logging";
import { Collections } from "../../entity/Collections";
import { Service, buildErrorResponse, buildResponse } from "../../entity/Service";
import admin = require('firebase-admin');
import { loginTokenSearch } from "./LoginTokenSearch";
import { LoginToken } from "../../entity/LoginToken";
import { Errors } from "../../entity/Errors";
import Bluebird = require("bluebird");

export const loginTokenDelete = (logging: ILogging): Service<LoginTokenDeleteRequest, LoginTokenDeleteResponse> => req => {
    logging.info("loginTokenDelete", "Starts");

    const db = admin.firestore();

    return loginTokenSearch(logging)({ refreshToken: req.refreshToken })
        .then(response => {
            if (response.error) {
                return buildErrorResponse(response.error);
            }

            if (!response.payload || !response.payload.loginTokens) {
                return buildErrorResponse(Errors.ERROR_WHILE_SEARCH_LOGIN_TOKEN);
            }

            return Bluebird
                .map(response.payload.loginTokens, (loginToken) => (
                    db.collection(Collections.LOGIN_TOKEN).doc(loginToken.refreshToken).delete().then(_ => loginToken)
                ), { concurrency: 5 })
                .then(results => buildResponse<LoginTokenDeleteResponse>({ deletedLoginTokens: results }));
        });

};

export interface LoginTokenDeleteRequest {
    refreshToken: string
}

export interface LoginTokenDeleteResponse {
    deletedLoginTokens: LoginToken[];
}