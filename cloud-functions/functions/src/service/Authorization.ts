import { ILogging } from "../book/Logging";
import { ServiceRequest } from "../entity/ServiceRequest";
import { ServiceResponse } from "../entity/ServiceResponse";
import functions = require('firebase-functions');

export const authorization = (logging: ILogging) => (req: AuthorizationRequest): Promise<AuthorizationResponse> => {
    try {
        logging.info("authorization", "Starts");

        return new Promise((resolve, reject) => {
            resolve(<AuthorizationResponse>{ payload: (functions.config().airqualitymonitor.secretkeys as string).split(";").indexOf(req.secretKey) !== -1 });
            return;
        });
    }
    catch (error) {
        logging.error("authorization", `Error while autorizating: ${error}`);
        return Promise.resolve(<AuthorizationResponse>{ error: error })
    }
};

export interface AuthorizationRequest extends ServiceRequest {
    secretKey: string;
}

export interface AuthorizationResponse extends ServiceResponse<boolean> {

};