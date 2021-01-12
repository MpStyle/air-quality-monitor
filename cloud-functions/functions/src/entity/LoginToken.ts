export interface AuthorizationToken {
    exp: number;
    iat: number;
    username: string;
    jti: string;
}