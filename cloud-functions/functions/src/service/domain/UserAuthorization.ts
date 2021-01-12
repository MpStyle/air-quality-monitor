import { ILogging } from "../../book/Logging";
import { Settings } from "../../book/Settings";
import { Errors } from "../../entity/Errors";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";

export const userAuthorization = (logging: ILogging): Service<UserAuthorizationRequest, {}> => req => {
    if (!req.accessToken) {
        return buildErrorResponse(Errors.INVALID_AUTHORIZATION_REQUEST);
    }

    const sJWT = jsrsasign.KJUR.jws.JWS.verifyJWT(req.accessToken, Settings.jwtPassword);

    if (sJWT) {
        return buildResponse({});
    }

    return buildErrorResponse(Errors.INVALID_AUTHENTICATION_TOKEN);
};

export interface UserAuthorizationRequest {
    accessToken: string;
}