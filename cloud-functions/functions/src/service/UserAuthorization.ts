import { ILogging } from "../book/Logging";
import { Errors } from "../entity/Errors";
import { buildErrorResponse, buildResponse, Service } from "../entity/Service";
import { authorization } from "./Authorization";

export const userAuthorization = (logging: ILogging): Service<UserAuthorizationRequest, UserAuthorizationResponse> => req => {
    try {
        if (!req.secretKey || req.secretKey === '') {
            return buildErrorResponse(Errors.INVALID_USER_DEVICE_SEARCH_REQUEST);
        }

        logging.info("userDevicesSearch", "Starts");

        return authorization(logging)({ secretKey: req.secretKey })
            .then(authorizationResponse => {
                if (authorizationResponse.error) {
                    return buildErrorResponse(authorizationResponse.error);
                }

                if (!authorizationResponse.payload) {
                    return buildErrorResponse(Errors.USER_UNAUTHORIZED);
                }

                return buildResponse<UserAuthorizationResponse>({ success: !!authorizationResponse.payload.authorizations.length });
            })
            .catch((err: any) => {
                logging.error("userDevicesSearch", `Error while searching devices: ${err}`);
                return buildErrorResponse(err);
            });
    }
    catch (error) {
        logging.error("userDevicesSearch", `Error while searching devices: ${error}`);
        return buildErrorResponse(error);
    }
}

export interface UserAuthorizationRequest {
    secretKey: string;
}

export interface UserAuthorizationResponse {
    success: boolean;
}