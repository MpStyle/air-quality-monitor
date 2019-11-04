import { ILogging } from "../book/Logging";
import { ServiceRequest } from "../entity/ServiceRequest";
import { ServiceResponse } from "../entity/ServiceResponse";
import functions = require('firebase-functions');

export const deviceAuthorization = (logging: ILogging) => (req: DeviceAuthorizationRequest): Promise<DeviceAuthorizationResponse> => {
    logging.info("deviceAuthorization", "Starts");

    return new Promise((resolve, reject) => {
        resolve(<DeviceAuthorizationResponse>{ payload: req.secretKey === functions.config().airqualitymonitor.secretkey });
        return;
    });
};

export interface DeviceAuthorizationRequest extends ServiceRequest {
    secretKey: string;
}

export interface DeviceAuthorizationResponse extends ServiceResponse<boolean> {

};