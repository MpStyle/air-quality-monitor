import { ILogging } from "../book/Logging";
import { Service, buildResponse, buildErrorResponse } from "../entity/Service";
import functions = require('firebase-functions');
import { Errors } from "../entity/Errors";
import admin = require('firebase-admin');
import { Collections } from "../entity/Collections";
import { LoginToken } from "../entity/LoginToken";
import { UserAuthorizations } from "../entity/UserAuthorizations";
import { Authorization } from "../entity/Authorization";

export const userAuthorization = (logging: ILogging): Service<UserAuthorizationRequest, UserAuthorizationResponse> => req => {
    if (!req.accessToken) {
        return buildErrorResponse(Errors.INVALID_AUTHORIZATION_REQUEST);
    }

    logging.info("authorization", "Starts");

    const db = admin.firestore();
    let collectionRef: FirebaseFirestore.CollectionReference | FirebaseFirestore.Query = db.collection(Collections.LOGIN_TOKEN);

    collectionRef = collectionRef.where('accessToken', '==', req.accessToken);

    return collectionRef.get()
        .then(snapshots => {
            if (!snapshots || snapshots.docs.length === 0) {
                logging.debug("authorization", "No access token found");
                return buildErrorResponse(Errors.INVALID_ACCESS_TOKEN);
            }

            const doc = snapshots.docs[0].data() as LoginToken;

            if (doc.expiredAt < (new Date()).getTime()) {
                return buildErrorResponse(Errors.EXPIRED_ACCESS_TOKEN);
            }

            const appAuthorizations: UserAuthorizations[] = JSON.parse(functions.config().airqualitymonitor.usersauthorizations);

            if (!appAuthorizations) {
                return buildErrorResponse(Errors.AUTHORIZATIONS_CONFIGURATION_NOT_FOUND);
            }

            return buildResponse<UserAuthorizationResponse>({
                authorizations: appAuthorizations
                    .filter(a => a.username === doc.username)
                    .reduce((acc, cur) => acc.concat(cur.authorizations), <Authorization[]>[])
            });
        })
        .catch((err: any) => {
            logging.error("authorization", `Error while authorizing user: ${err}`);
            return buildErrorResponse(err);
        });
};

export interface UserAuthorizationRequest {
    accessToken: string;
}

export interface UserAuthorizationResponse {
    authorizations: Authorization[]
};