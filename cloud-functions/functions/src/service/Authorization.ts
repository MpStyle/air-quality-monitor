import { ILogging } from "../book/Logging";
import { Service, buildResponse, buildErrorResponse } from "../entity/Service";
import functions = require('firebase-functions');
import { Authorization, AppAuthorizations } from "../entity/AppAuthorizations";
import { Errors } from "../entity/Errors";

export const authorization = (logging: ILogging): Service<AuthorizationRequest, AuthorizationResponse> => req => {
    try {
        logging.info("authorization", "Starts");
        const appAuthorizations: AppAuthorizations[] = functions.config().airqualitymonitor.authorizations;

        if (!appAuthorizations) {
            return buildErrorResponse(Errors.AUTHORIZATIONS_CONFIGURATION_NOT_FOUND);
        }

        return buildResponse<AuthorizationResponse>({
            authorizations: appAuthorizations
                .filter(a => a.secretKey === req.secretKey)
                .reduce((acc, cur) => acc.concat(cur.authorizations), <Authorization[]>[])
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
    authorizations: Authorization[]
};