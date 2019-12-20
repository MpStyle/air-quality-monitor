import { ServiceResponse } from "./ServiceResponse";

export interface Service<TReq, TPayload> {
    (request: TReq): Promise<ServiceResponse<TPayload>>
}