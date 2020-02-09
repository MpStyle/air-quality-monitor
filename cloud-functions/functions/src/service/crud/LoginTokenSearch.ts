import { ILogging } from "../../book/Logging";
import { Collections } from "../../entity/Collections";
import { Errors } from "../../entity/Errors";
import { LoginToken } from "../../entity/LoginToken";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import admin = require('firebase-admin');
import { PagedRequest } from "../../entity/PagedRequest";

export const loginTokenSearch = (logging: ILogging): Service<LoginTokenSearchRequest, LoginTokenSearchResponse> => req => {
    logging.info("loginTokenSearch", "Starts");

    const db = admin.firestore();
    let collectionRef: FirebaseFirestore.CollectionReference | FirebaseFirestore.Query = db.collection(Collections.LOGIN_TOKEN);

    if (req.refreshToken) {
        collectionRef = collectionRef.where('refreshToken', '==', req.refreshToken);
    }

    if (req.expiredBefore) {
        collectionRef = collectionRef.where('expiredAt', '<', req.expiredBefore);
    }

    if (req.offset) {
        collectionRef = collectionRef.startAt(req.offset);
    }

    if (req.limit) {
        collectionRef = collectionRef.endAt(req.offset ? req.offset + req.limit : req.limit);
    }

    collectionRef = collectionRef.where('enabled', '==', true);

    return collectionRef.get()
        .then(snapshots => {
            if (!snapshots || snapshots.docs.length === 0) {
                return buildErrorResponse(Errors.ERROR_WHILE_SEARCH_LOGIN_TOKEN);
            }

            return buildResponse<LoginTokenSearchResponse>({ loginTokens: snapshots.docs.map(snapshot => <LoginToken>snapshot.data()) });
        })
        .catch((err: any) => {
            logging.error("loginTokenSearch", `Error while renew access token: ${err}`);
            return buildErrorResponse(err);
        });
};

export interface LoginTokenSearchRequest extends PagedRequest {
    refreshToken?: string;
    expiredBefore?: number;
}

export interface LoginTokenSearchResponse {
    loginTokens: LoginToken[];
}