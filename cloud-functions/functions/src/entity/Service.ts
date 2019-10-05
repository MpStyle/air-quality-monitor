import { ServiceResponse } from "./ServiceResponse";

export interface Service<TReq, TPayload> {
    (request: TReq): ServiceResponse<TPayload>
}

export interface ServiceAsync<TReq, TPayload> {
    (request: TReq): Promise<ServiceResponse<TPayload>>
}