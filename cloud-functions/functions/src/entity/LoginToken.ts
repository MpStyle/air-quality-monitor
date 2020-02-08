export interface LoginToken {
    accessToken: string;
    expiredAt: number;
    refreshToken: string;
    username: string;
    enabled: boolean;
    updated: number;
}