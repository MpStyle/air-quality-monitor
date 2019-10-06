import { ServiceAsync } from "../entity/Service";
import { ServiceResponse } from "../entity/ServiceResponse";

export const authorization: ServiceAsync<AuthorizationRequest, boolean> = (req: AuthorizationRequest): Promise<AuthorizationResponse> => {
    return new Promise((resolve, reject) => {
        return <AuthorizationResponse>{ payload: req.accessToken === "123456" };
    });
};

export interface AuthorizationRequest {
    accessToken: string;
}

export interface AuthorizationResponse extends ServiceResponse<boolean> {

};