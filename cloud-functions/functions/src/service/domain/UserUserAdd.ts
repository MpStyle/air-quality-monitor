import { ILogging } from "../../book/Logging";
import { User } from "../../entity/User";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import { userUpsert } from "../crud/UserUpsert";
import uuid = require("uuid");
import { Errors } from "../../entity/Errors";
import { userAuthorization } from "./UserAuthorization";

export const userUserAdd = (logging: ILogging): Service<UserUserAddRequest, UserUserAddResponse> => req => {
    logging.info("userUserDelete", "Starts");

    return userAuthorization(logging)({ accessToken: req.accessToken })
        .then(authorizationResponse => {
            if (authorizationResponse.error) {
                return buildErrorResponse(authorizationResponse.error);
            }

            if (!authorizationResponse.payload) {
                return buildErrorResponse(Errors.USER_UNAUTHORIZED);
            }

            const userUpsertService = userUpsert(logging);
            const user = {
                username: req.username,
                password: req.password,
                inserted: Date.now(),
                updated: Date.now(),
            } as User;

            return userUpsertService({ user })
                .then(userUpsertResponse => {
                    if (userUpsertResponse.error) {
                        return buildErrorResponse(userUpsertResponse.error);
                    }

                    if (!userUpsertResponse.payload || !userUpsertResponse.payload.user) {
                        return buildErrorResponse(Errors.ERROR_WHILE_ADD_USER);
                    }

                    return buildResponse({ user: userUpsertResponse.payload.user });
                });
        })
        .catch((error: any) => {
            logging.error("userUserAdd", `Error while add user: ${JSON.stringify(error)}`);
            return buildErrorResponse(Errors.ERROR_WHILE_ADD_USER);
        });
};

export interface UserUserAddRequest {
    username: string;
    password: string;
    accessToken: string;
}

export interface UserUserAddResponse {
    user: User;
}