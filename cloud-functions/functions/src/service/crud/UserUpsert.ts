import { ILogging } from "../../book/Logging";
import { Collections } from "../../entity/Collections";
import { Errors } from "../../entity/Errors";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import { User } from "../../entity/User";
import { userById, UserByIdRequest } from "./UserById";
import admin = require('firebase-admin');

export const userUpsert = (logging: ILogging): Service<UserUpsertRequest, UserUpsertResponse> => req => {
    if (!req.user || !req.user.username || !req.user.password) {
        return buildErrorResponse(Errors.INVALID_USER_ADD_REQUEST);
    }

    logging.info("userUpsert", "Starts");

    const userToAdd: User = {
        ...req.user,
        enabled: req.user.enabled ?? true
    };
    const db = admin.firestore();
    const docRef = db.collection(Collections.USER).doc(userToAdd.username);

    return docRef
        .set(userToAdd)
        .then(result => {
            logging.debug("userUpsert", `Add user result: ${JSON.stringify(result.writeTime)}`);
            if (!result.writeTime) {
                return buildErrorResponse(Errors.ERROR_WHILE_ADD_USER);
            }

            return userById(logging)(<UserByIdRequest>{ username: userToAdd.username })
                .then(response => {
                    if (response.error) {
                        logging.error("userUpsert", `Error 01: ${response.error}`);
                        return buildErrorResponse(response.error);
                    }

                    return buildResponse({ user: response.payload?.user });
                });
        })
        .catch((err: any) => {
            logging.error("userUpsert", `Error while adding user: ${err}`);
            return buildErrorResponse(err);
        });
};

export interface UserUpsertRequest {
    user: User;
}

export interface UserUpsertResponse {
    user?: User;
}