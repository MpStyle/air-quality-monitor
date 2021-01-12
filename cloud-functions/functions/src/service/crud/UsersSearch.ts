import { ILogging } from "../../book/Logging";
import { Collections } from "../../entity/Collections";
import { User } from "../../entity/User";
import { PagedRequest } from "../../entity/PagedRequest";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import admin = require('firebase-admin');

export const usersSearch = (logging: ILogging): Service<UsersSearchRequest, UsersSearchResponse> => req => {
    logging.info("usersSearch", "Starts");

    const db = admin.firestore();
    let collectionRef: FirebaseFirestore.CollectionReference | FirebaseFirestore.Query = db.collection(Collections.USER);

    if (req.username) {
        collectionRef = collectionRef.where('username', '==', req.username);
    }

    if (req.password) {
        collectionRef = collectionRef.where('password', '==', req.password);
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
                logging.debug("usersSearch", "No user found");
                return buildResponse({ users: [] });
            }

            return buildResponse({ users: snapshots.docs.map(snapshot => <User>snapshot.data()) });
        })
        .catch((err: any) => {
            logging.error("usersSearch", `Error while searching user: ${err}`);
            return buildErrorResponse(err);
        });
};

export interface UsersSearchRequest extends PagedRequest {
    username?: string;
    password?: string;
}

export interface UsersSearchResponse {
    users: User[];
}