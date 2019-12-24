import { ILogging } from "../book/Logging";
import { Service, buildErrorResponse, buildResponse } from "../entity/Service";
import { User } from "../entity/User";
import functions = require('firebase-functions');
import { Errors } from "../entity/Errors";
import { StringUtils } from "../book/StringUtils";
import admin = require('firebase-admin');
import { Collections } from "../entity/Collections";
import { LoginToken } from "../entity/LoginToken";

export const userLogin = (logging: ILogging): Service<UserLoginRequest, UserLoginResponse> => req => {
    if (!req.username || !req.password) {
        return buildErrorResponse(Errors.INVALID_USER_LOGIN_REQUEST);
    }

    const users: User[] = JSON.parse(functions.config().airqualitymonitor.users);

    if (!users || !users.length) {
        return buildErrorResponse(Errors.USERS_CONFIGURATION_NOT_FOUND);
    }

    const user = users.find(u => u.password === req.password && u.username === req.username);

    if (!user) {
        return buildErrorResponse(Errors.USER_NOT_FOUND);
    }

    const userLoginData = {
        accessToken: StringUtils.randomString(),
        refreshToken: StringUtils.randomString(),
        expiredAt: (new Date()).getTime() + 300000, // 5 minutes
        username: user.username
    } as LoginToken;

    const db = admin.firestore();
    const docRef = db.collection(Collections.LOGIN_TOKEN).doc(userLoginData.refreshToken);

    return docRef
        .set(userLoginData)
        .then(result => {
            if (!result.writeTime) {
                return buildErrorResponse(Errors.ERROR_WHILE_ADD_DEVICE);
            }

            return buildResponse({
                accessToken: userLoginData.accessToken,
                refreshToken: userLoginData.refreshToken,
                expiredAt: userLoginData.expiredAt
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