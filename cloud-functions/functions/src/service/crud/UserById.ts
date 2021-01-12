import { ILogging } from "../../book/Logging";
import { Collections } from "../../entity/Collections";
import { User } from "../../entity/User";
import { Errors } from "../../entity/Errors";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import admin = require('firebase-admin');

export const userById = (logging: ILogging): Service<UserByIdRequest, UserByIdResponse> => req => {
    if (!req.username) {
        return buildErrorResponse(Errors.INVALID_USER_BY_ID_REQUEST);
    }

    logging.info("userById", "Starts");

    const db = admin.firestore();
    const collectionRef = db.collection(Collections.USER).doc(req.username);

    return collectionRef.get()
        .then(snapshot => {
            if (!snapshot) {
                logging.debug("userById", "No user found");
                return buildResponse<UserByIdResponse>({ user: undefined });
            }

            return buildResponse<UserByIdResponse>({ user: snapshot.data() as User });
        })
        .catch((err: any) => {
            logging.error("userById", `Error while searching user: ${err}`);
            return buildErrorResponse(err);
        });
};

export interface UserByIdRequest {
    username: string;
}

export interface UserByIdResponse {
    user?: User;
}