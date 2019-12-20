export interface Service<TReq, TPayload> {
    (request: TReq): Promise<ServiceResponse<TPayload>>
}

export interface ServiceResponse<TPayload> extends ServiceErrorResponse, ServicePayloadResponse<TPayload> {
}

export interface ServiceErrorResponse {
    error?: any;
}

export interface ServicePayloadResponse<TPayload> {
    payload?: TPayload;
}

export const buildErrorResponse: (error: any) => Promise<ServiceResponse<any>> = (error: any) => Promise.resolve({ error });

export const buildResponse: <TPayload>(payload: TPayload, error?: any) => Promise<ServiceResponse<TPayload>> = <TPayload>(payload: TPayload, error?: any) => Promise.resolve({ payload, error });