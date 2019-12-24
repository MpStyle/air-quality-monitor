import { Authorization } from "./Authorization";

export interface DeviceAuthorizations {
    secretKey: string,
    authorizations: Authorization[];
}