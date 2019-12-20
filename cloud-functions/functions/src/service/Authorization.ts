import { ILogging } from "../book/Logging";
import { Service, buildResponse, buildErrorResponse } from "../entity/Service";
import functions = require('firebase-functions');

export const authorization = (logging: ILogging): Service<AuthorizationRequest, AuthorizationResponse> => req => {
    try {
        logging.info("authorization", "Starts");

        return buildResponse({
            authorized: (functions.config().airqualitymonitor.secretkeys as string).split(";").indexOf(req.secretKey) !== -1
        });
    }
    catch (error) {
        logging.error("authorization", `Error while autorizating: ${error}`);
        return buildErrorResponse(error);
    }
};

export interface AuthorizationRequest {
    secretKey: string;
}

export interface AuthorizationResponse {
    authorized: boolean;
};