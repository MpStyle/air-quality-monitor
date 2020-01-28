import { ILogging } from "../../book/Logging";
import { Authorization } from "../../entity/Authorization";
import { DeviceAuthorizations } from "../../entity/DeviceAuthorizations";
import { Errors } from "../../entity/Errors";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import functions = require('firebase-functions');

export const deviceAuthorization = (logging: ILogging): Service<DeviceAuthorizationRequest, DeviceAuthorizationResponse> => req => {
    try {
        logging.info("authorization", "Starts");

        const appAuthorizations: DeviceAuthorizations[] = JSON.parse(functions.config().airqualitymonitor.devicesauthorizations);

        if (!appAuthorizations) {
            return buildErrorResponse(Errors.AUTHORIZATIONS_CONFIGURATION_NOT_FOUND);
        }

        return buildResponse<DeviceAuthorizationResponse>({
            authorizations: appAuthorizations
                .filter(a => a.secretKey === req.secretKey)
                .reduce((acc, cur) => acc.concat(cur.authorizations), <Authorization[]>[])
        });
    }
    catch (error) {
        logging.error("deviceAuthorization", `Error while autorizating: ${error}`);
        return buildErrorResponse(error);
    }
};

export interface DeviceAuthorizationRequest {
    secretKey: string;
}

export interface DeviceAuthorizationResponse {
    authorizations: Authorization[]
};