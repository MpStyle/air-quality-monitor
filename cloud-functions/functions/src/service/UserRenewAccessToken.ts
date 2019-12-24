import { ILogging } from "../book/Logging";
import { StringUtils } from "../book/StringUtils";
import { Collections } from "../entity/Collections";
import { Errors } from "../entity/Errors";
import { LoginToken } from "../entity/LoginToken";
import { buildErrorResponse, buildResponse, Service } from "../entity/Service";
import admin = require('firebase-admin');

export const userNewAccessToken = (logging: ILogging): Service<UserNewAccessTokenRequest, UserNewAccessTokenResponse> => req => {
    if (!req.refreshToken) {
        return buildErrorResponse(Errors.INVALID_USER_NEW_ACCESS_TOKEN_REQUEST);
    }

    const db = admin.firestore();
    let collectionRef: FirebaseFirestore.CollectionReference | FirebaseFirestore.Query = db.collection(Collections.LOGIN_TOKEN);

    collectionRef = collectionRef.where('refreshToken', '==', req.refreshToken);

    return collectionRef.get()
        .then(snapshots => {
            if (!snapshots || snapshots.docs.length === 0) {
                logging.debug("userNewAccessToken", "No refresh token found");
                return buildErrorResponse(Errors.INVALID_REFRESH_TOKEN);
            }

            const doc = snapshots.docs[0].data() as LoginToken;
            const docRef = db.collection(Collections.LOGIN_TOKEN).doc(doc.refreshToken);

            const userLoginData = {
                accessToken: StringUtils.randomString(),
                refreshToken: doc.refreshToken,
                expiredAt: (new Date()).getTime() + 300000, // 5 minutes
                username: doc.username
            } as LoginToken;

            return docRef
                .set(userLoginData)
                .then(result => {
                    if (!result.writeTime) {
                        return buildErrorResponse(Errors.ERROR_WHILE_ADD_DEVICE);
                    }

                    return buildResponse({
                        accessToken: userLoginData.accessToken,
                        expiredAt: userLoginData.expiredAt
                    });
                })
                .catch(err => {
                    logging.error("userLogin", `Error while login: ${err}`);
                    return buildErrorResponse(err);
                });
        })
        .catch((err: any) => {
            logging.error("userNewAccessToken", `Error while renew access token: ${err}`);
            return buildErrorResponse(err);
        });
};

export interface UserNewAccessTokenRequest {
    refreshToken: string;
}

export interface UserNewAccessTokenResponse {
    accessToken: string;
    expiresIn: number;
}