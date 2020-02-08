import { ILogging } from "../../book/Logging";
import { Collections } from "../../entity/Collections";
import { Errors } from "../../entity/Errors";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import { loginTokenSearch } from "../crud/LoginTokenSearch";
import admin = require('firebase-admin');
import { loginTokenAdd } from "../crud/LoginTokenAdd";

export const userRenewAccessToken = (logging: ILogging): Service<UserRenewAccessTokenRequest, UserRenewAccessTokenResponse> => req => {
    if (!req.refreshToken) {
        return buildErrorResponse(Errors.INVALID_USER_NEW_ACCESS_TOKEN_REQUEST);
    }

    logging.info("userRenewAccessToken", "Starts");

    const db = admin.firestore();
    let collectionRef: FirebaseFirestore.CollectionReference | FirebaseFirestore.Query = db.collection(Collections.LOGIN_TOKEN);

    collectionRef = collectionRef.where('refreshToken', '==', req.refreshToken);

    return loginTokenSearch(logging)({ refreshToken: req.refreshToken })
        .then(loginTokenSearchResponse => {
            if (loginTokenSearchResponse.error) {
                return buildErrorResponse(loginTokenSearchResponse.error);
            }

            if (!loginTokenSearchResponse.payload || !loginTokenSearchResponse.payload.loginTokens || !loginTokenSearchResponse.payload.loginTokens.length) {
                return buildErrorResponse(Errors.ERROR_WHILE_SEARCH_LOGIN_TOKEN);
            }

            const loginToken = loginTokenSearchResponse.payload.loginTokens[0];

            return loginTokenAdd(logging)({
                username: loginToken.username,
                expiredAt: Date.now() + 300000,
                refreshToken: loginToken.refreshToken
            }).then(loginTokenAddResponse => {
                if (loginTokenAddResponse.error) {
                    return buildErrorResponse(loginTokenAddResponse.error);
                }

                if (!loginTokenAddResponse.payload || !loginTokenAddResponse.payload.loginToken) {
                    return buildErrorResponse(Errors.ERROR_WHILE_RENEW_ACCESS_TOKEN);
                }

                return buildResponse<UserRenewAccessTokenResponse>({
                    accessToken: loginTokenAddResponse.payload.loginToken.accessToken,
                    expiredAt: loginTokenAddResponse.payload.loginToken.expiredAt
                });
            });
        })
        .catch((err: any) => {
            logging.error("userRenewAccessToken", `Error while renew access token: ${err}`);
            return buildErrorResponse(err);
        });
};

export interface UserRenewAccessTokenRequest {
    refreshToken: string;
}

export interface UserRenewAccessTokenResponse {
    accessToken: string;
    expiredAt: number;
}