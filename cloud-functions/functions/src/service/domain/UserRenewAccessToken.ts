import { ILogging } from "../../book/Logging";
import { Collections } from "../../entity/Collections";
import { Errors } from "../../entity/Errors";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import { loginTokenSearch } from "../crud/LoginTokenSearch";
import admin = require('firebase-admin');

export const userRenewAccessToken = (logging: ILogging): Service<UserRenewAccessTokenRequest, UserRenewAccessTokenResponse> => req => {
    if (!req.refreshToken) {
        return buildErrorResponse(Errors.INVALID_USER_NEW_ACCESS_TOKEN_REQUEST);
    }

    logging.info("userRenewAccessToken", "Starts");

    const db = admin.firestore();
    let collectionRef: FirebaseFirestore.CollectionReference | FirebaseFirestore.Query = db.collection(Collections.LOGIN_TOKEN);

    collectionRef = collectionRef.where('refreshToken', '==', req.refreshToken);

    return loginTokenSearch(logging)({ refreshToken: req.refreshToken })
        .then(response => {
            if (response.error) {
                return buildErrorResponse(response.error);
            }

            if (!response.payload || !response.payload.loginTokens || !response.payload.loginTokens.length) {
                return buildErrorResponse(Errors.ERROR_WHILE_RENEW_ACCESS_TOKEN);
            }

            return buildResponse<UserRenewAccessTokenResponse>({
                accessToken: response.payload.loginTokens[0].accessToken,
                expiredAt: response.payload.loginTokens[0].expiredAt
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