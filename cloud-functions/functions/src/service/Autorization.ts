import { ServiceAsync } from "../entity/Service";
import { ServiceResponse } from "../entity/ServiceResponse";
import fs = require('fs');
import { Errors } from "../entity/Errors";

export const authorization: ServiceAsync<AuthorizationRequest, boolean> = (req: AuthorizationRequest): Promise<AuthorizationResponse> => {
    return new Promise((resolve, reject) => {
        fs.readFile('/opt/access-token.conf', 'utf8', function (err, contents) {
            if (err) {
                reject(err);
                return;
            }

            if (contents === req.accessToken) {
                resolve(<AuthorizationResponse>{ payload: true });
                return;
            }

            resolve(<AuthorizationResponse>{ payload: false, error: Errors.INVALID_ACCESS_TOKEN });
        });
    });
};

export interface AuthorizationRequest {
    accessToken: string;
}

export interface AuthorizationResponse extends ServiceResponse<boolean> {

};