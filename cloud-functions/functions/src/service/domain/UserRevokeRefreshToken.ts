import { ILogging } from "../../book/Logging";
import { Errors } from "../../entity/Errors";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import { loginTokenById } from "../crud/LoginTokenById";
import { StringUtils } from "../../book/StringUtils";
import { loginTokenUpsert } from "../crud/LoginTokenUpsert";

export const userRevokeRefreshToken = (logging: ILogging): Service<UserRevokeRefreshTokenRequest, {}> => req => {
    if (StringUtils.isNullOrEmpty(req.refreshToken)) {
        return buildErrorResponse(Errors.INVALID_USER_REVOKE_REFRESH_TOKEN_REQUEST);
    }

    logging.info("userRevokeRefreshToken", "Starts");

    return loginTokenById(logging)({
        refreshToken: req.refreshToken
    })
        .then(response => {
            if (response.error) {
                return buildErrorResponse(response.error);
            }

            if (!response.payload || !response.payload.loginToken) {
                return buildErrorResponse(Errors.LOGIN_TOKEN_NOT_FOUND);
            }

            return loginTokenUpsert(logging)({
                loginToken: {
                    ...response.payload.loginToken,
                    enabled: false
                }
            })
                .then(_ => buildResponse({}));
        });
}

export interface UserRevokeRefreshTokenRequest {
    refreshToken: string;
}