import { ILogging } from "../book/Logging";
import { ServiceRequest } from "../entity/ServiceRequest";
import { ServiceResponse } from "../entity/ServiceResponse";

export const authorization = (logging: ILogging) => (req: AuthorizationRequest): Promise<AuthorizationResponse> => {
    return new Promise((resolve, reject) => {
        logging.log("authorization", "authorized");
        resolve(<AuthorizationResponse>{ payload: req.accessToken === "123456" });
        return;
    });
};

export interface AuthorizationRequest extends ServiceRequest {
    accessToken: string;
}

export interface AuthorizationResponse extends ServiceResponse<boolean> {

};