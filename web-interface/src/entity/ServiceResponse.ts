export interface ServiceResponse<TPayload> extends ServiceErrorResponse, ServicePayloadResponse<TPayload> {
}

export interface ServiceErrorResponse {
    error?: any;
}

export interface ServicePayloadResponse<TPayload> {
    payload?: TPayload;
}