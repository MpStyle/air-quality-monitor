import { ServiceAsync } from "../entity/Service";
import { ServiceResponse } from "../entity/ServiceResponse";
import { ServiceRequest } from "../entity/ServiceRequest";

export const authorization: ServiceAsync<AuthorizationRequest, boolean> = (req: AuthorizationRequest): Promise<AuthorizationResponse> => {
    return new Promise((resolve, reject) => {
        resolve(<AuthorizationResponse>{ payload: req.accessToken === "123456" });
        return;
    });
};

export interface AuthorizationRequest extends ServiceRequest {
    accessToken: string;
}

export interface AuthorizationResponse extends ServiceResponse<boolean> {

};