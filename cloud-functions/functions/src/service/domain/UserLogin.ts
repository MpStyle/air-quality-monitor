import { ILogging } from "../../book/Logging";
import { Errors } from "../../entity/Errors";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import { User } from "../../entity/User";
import functions = require('firebase-functions');
import { loginTokenUpsert } from "../crud/LoginTokenUpsert";
import uuid = require("uuid");

export const userLogin = (logging: ILogging): Service<UserLoginRequest, UserLoginResponse> => req => {
    if (!req.username || !req.password) {
        return buildErrorResponse(Errors.INVALID_USER_LOGIN_REQUEST);
    }

    logging.info("userLogin", "Starts");

    const users: User[] = JSON.parse(functions.config().airqualitymonitor.users);

    if (!users || !users.length) {
        return buildErrorResponse(Errors.USERS_CONFIGURATION_NOT_FOUND);
    }

    const user = users.find(u => u.password === req.password && u.username === req.username);

    if (!user) {
        return buildErrorResponse(Errors.USER_NOT_FOUND);
    }

    return loginTokenUpsert(logging)({
        loginToken: {
            username: req.username,
            expiredAt: Date.now() + 5 * 60 * 1000,
            refreshToken: uuid.v4(),
            accessToken: uuid.v4()
        }
    })
        .then(result => {
            if (result.error) {
                return buildErrorResponse(result.error);
            }

            if (!result.payload) {
                return buildErrorResponse(Errors.ERROR_WHILE_USER_LOGIN);
            }

            return buildResponse<UserLoginResponse>({
                accessToken: result.payload.loginToken?.accessToken as string,
                refreshToken: result.payload.loginToken?.refreshToken as string,
                expiredAt: result.payload.loginToken?.expiredAt as number
            });
        })
        .catch(err => {
            logging.error("userLogin", `Error while login: ${err}`);
            return buildErrorResponse(err);
        });
};

export interface UserLoginRequest {
    username: string;
    password: string;
}

export interface UserLoginResponse {
    accessToken: string;
    expiredAt: number;
    refreshToken: string;
}