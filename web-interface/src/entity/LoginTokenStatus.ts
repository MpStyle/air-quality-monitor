import { LoadingState } from "./LoadingState";
import { LoginToken } from "./LoginToken";

export interface LoginTokenStatus {
    loginToken: LoginToken | null;
    loadingState: LoadingState;
}