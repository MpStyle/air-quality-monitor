import { ILogging } from "../../book/Logging";
import { Errors } from "../../entity/Errors";
import { AuthorizationToken } from "../../entity/LoginToken";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import uuid = require("uuid");
import { usersSearch } from "../crud/UsersSearch";
import { Settings } from "../../book/Settings";

export const userLogin = (logging: ILogging): Service<UserLoginRequest, UserLoginResponse> => req => {
    if (!req.username || !req.password) {
        return buildErrorResponse(Errors.INVALID_USER_LOGIN_REQUEST);
    }

    logging.info("userLogin", "Starts");

    return usersSearch(logging)({
        username: req.username,
        password: req.password
    })
        .then(usersSearchResponse => {
            if (usersSearchResponse.error) {
                return buildErrorResponse(usersSearchResponse.error);
            }

            if (!usersSearchResponse.payload?.users?.length) {
                return buildErrorResponse(Errors.LOGIN_FAILS);
            }

            const jwtHeader = { alg: 'HS256', typ: 'JWT' };
            const iat = jsrsasign.KJUR.jws.IntDate.get('now');
            const exp = jsrsasign.KJUR.jws.IntDate.get('now + 1hour');
            const authenticationToken = {
                iat: iat,
                exp: exp,
                jti: uuid.v4(),
                username: usersSearchResponse.payload.users[0].username
            } as AuthorizationToken;
            const jsonHeader = JSON.stringify(jwtHeader);
            const jsonPayload = JSON.stringify(authenticationToken);
            const sJWT = jsrsasign.KJUR.jws.JWS.sign("HS256", jsonHeader, jsonPayload, Settings.jwtPassword);

            return buildResponse({ authorizationToken: sJWT });
        });
};

export interface UserLoginRequest {
    username: string;
    password: string;
}

export interface UserLoginResponse {
    authorizationToken: string;
}