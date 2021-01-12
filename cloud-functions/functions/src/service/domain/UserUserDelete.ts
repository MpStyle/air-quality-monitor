import { ILogging } from "../../book/Logging";
import { StringUtils } from "../../book/StringUtils";
import { User } from "../../entity/User";
import { Errors } from "../../entity/Errors";
import { buildErrorResponse, Service } from "../../entity/Service";
import { userById } from "../crud/UserById";
import { userUpsert } from "../crud/UserUpsert";
import { userAuthorization } from "./UserAuthorization";

export const userUserDelete = (logging: ILogging): Service<UserUserDeleteRequest, UserUserDeleteResponse> => req => {
    if (StringUtils.isNullOrEmpty(req.accessToken) || StringUtils.isNullOrEmpty(req.username)) {
        return buildErrorResponse(Errors.INVALID_USER_USER_SEARCH_REQUEST);
    }

    logging.info("userUserDelete", "Starts");

    return userAuthorization(logging)({ accessToken: req.accessToken })
        .then(authorizationResponse => {
            if (authorizationResponse.error) {
                return buildErrorResponse(authorizationResponse.error);
            }

            if (!authorizationResponse.payload) {
                return buildErrorResponse(Errors.USER_UNAUTHORIZED);
            }

            return userById(logging)({ username: req.username })
                .then(response => {
                    if (response.error) {
                        return buildErrorResponse(response.error);
                    }

                    if (!response.payload || !response.payload.user) {
                        return buildErrorResponse(Errors.USER_NOT_FOUND);
                    }

                    return userUpsert(logging)({
                        user: {
                            ...response.payload.user,
                            enabled: false
                        }
                    });
                });
        })
        .catch((error: any) => {
            logging.error("userUserDelete", `Error while delete user: ${JSON.stringify(error)}`);
            return buildErrorResponse(Errors.ERROR_WHILE_DELETE_USER);
        });
};

export interface UserUserDeleteRequest {
    accessToken: string,
    username: string;
}

export interface UserUserDeleteResponse {
    user: User;
}