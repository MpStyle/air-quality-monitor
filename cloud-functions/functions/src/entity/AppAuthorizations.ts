export interface AppAuthorizations {
    secretKey: string,
    authorizations: Authorization[];
}

export interface Authorization {
    deviceId: string;
    scopes: string[];
}