import { ILogging } from "../../book/Logging";
import { Errors } from "../../entity/Errors";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import { loginTokenById } from "../crud/LoginTokenById";
import { loginTokenUpsert } from "../crud/LoginTokenUpsert";
import uuid = require("uuid");

export const userRenewAccessToken = (logging: ILogging): Service<UserRenewAccessTokenRequest, UserRenewAccessTokenResponse> => req => {
    if (!req.refreshToken) {
        return buildErrorResponse(Errors.INVALID_USER_NEW_ACCESS_TOKEN_REQUEST);
    }

    logging.info("userRenewAccessToken", "Starts");

    return loginTokenById(logging)({ refreshToken: req.refreshToken })
        .then(loginTokenSearchResponse => {
            if (loginTokenSearchResponse.error) {
                return buildErrorResponse(loginTokenSearchResponse.error);
            }

            if (!loginTokenSearchResponse.payload || !loginTokenSearchResponse.payload.loginToken) {
                return buildErrorResponse(Errors.LOGIN_TOKEN_NOT_FOUND);
            }

            return loginTokenUpsert(logging)({
                loginToken: {
                    ...loginTokenSearchResponse.payload.loginToken,
                    accessToken: uuid.v4(),
                    expiredAt: Date.now() + 300000
                }
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