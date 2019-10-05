export interface ServiceResponse<TPayload> {
    error?: any;
    payload?: TPayload;
}