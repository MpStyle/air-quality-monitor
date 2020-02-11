import { ILogging } from "../../book/Logging";
import { Errors } from "../../entity/Errors";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import { loginTokenAdd } from "../crud/LoginTokenAdd";

export const userRevokeRefreshToken = (logging: ILogging): Service<UserRevokeRefreshTokenRequest, {}> => req => {
    if (!req.refreshToken) {
        return buildErrorResponse(Errors.INVALID_USER_REVOKE_REFRESH_TOKEN_REQUEST);
    }

    logging.info("userRevokeRefreshToken", "Starts");

    return loginTokenAdd(logging)({ refreshToken: req.refreshToken, enabled: false })
        .then(response => {
            if (response.error) {
                return buildErrorResponse(response.error);
            }

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