import { ILogging } from "../book/Logging";
import { ServiceRequest } from "../entity/ServiceRequest";
import { ServiceResponse } from "../entity/ServiceResponse";
import functions = require('firebase-functions');

export const deviceAuthorization = (logging: ILogging) => (req: DeviceAuthorizationRequest): Promise<DeviceAuthorizationResponse> => {
    logging.info("deviceAuthorization", "Starts");

    return new Promise((resolve, reject) => {
        resolve(<DeviceAuthorizationResponse>{ payload: (functions.config().airqualitymonitor.secretkeys as string).split(";").indexOf(req.secretKey) !== -1 });
        return;
    });
};

export interface DeviceAuthorizationRequest extends ServiceRequest {
    secretKey: string;
}

export interface DeviceAuthorizationResponse extends ServiceResponse<boolean> {

};