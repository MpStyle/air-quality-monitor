import { ILogging } from "../../book/Logging";
import { Collections } from "../../entity/Collections";
import { Errors } from "../../entity/Errors";
import { LoginToken } from "../../entity/LoginToken";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import admin = require('firebase-admin');

export const loginTokenById = (logging: ILogging): Service<LoginTokenByIdRequest, LoginTokenByIdResponse> => req => {
    if (!req.refreshToken || req.refreshToken === '') {
        return buildErrorResponse(Errors.INVALID_LOGIN_TOKEN_BY_ID_REQUEST);
    }

    logging.info("loginTokenById", "Starts");

    const db = admin.firestore();
    const collectionRef = db.collection(Collections.LOGIN_TOKEN).doc(req.refreshToken);

    return collectionRef.get()
        .then(snapshot => {
            if (!snapshot) {
                logging.debug("loginTokenById", "No device found");
                return buildResponse<LoginTokenByIdResponse>({ loginToken: undefined });
            }

            return buildResponse<LoginTokenByIdResponse>({ loginToken: snapshot.data() as LoginToken });
        })
        .catch((err: any) => {
            logging.error("loginTokenById", `Error while searching login token: ${err}`);
            return buildErrorResponse(err);
        });
};

export interface LoginTokenByIdRequest {
    refreshToken: string;
}

export interface LoginTokenByIdResponse {
    loginToken?: LoginToken;
}