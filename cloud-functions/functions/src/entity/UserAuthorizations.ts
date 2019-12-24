import { Authorization } from "./Authorization";

export interface UserAuthorizations {
    username: string,
    authorizations: Authorization[];
}