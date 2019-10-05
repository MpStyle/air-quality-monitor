import { ServiceAsync } from "../entity/Service";
import { ServiceResponse } from "../entity/ServiceResponse";
import { User } from "../entity/User";
import admin = require('firebase-admin');
import { Errors } from "../entity/Errors";
import { Collections } from "../entity/Collections";
import functions = require('firebase-functions');

export const userAdd: ServiceAsync<UserAddRequest, User> = async (req: UserAddRequest): Promise<UserAddResponse> => {
    if (!req.googleEmail || req.googleEmail === ''
        || !req.googleToken || req.googleToken === '') {
        return Promise.resolve(<UserAddResponse>{ error: Errors.INVALID_USER_ADD_REQUEST });
    }

    return admin
        .auth()
        .verifyIdToken(req.googleToken)
        .then(verifyTokenResult => {
            const googleEmail = verifyTokenResult.email;
            const googleUserId = verifyTokenResult.uid;

            if (googleEmail !== req.googleEmail) {
                return Promise.resolve(<UserAddResponse>{ error: Errors.USER_NOT_FOUND });
            }

            admin.initializeApp(functions.config().firebase);

            const db = admin.firestore();
            const collectionRef = db.collection(Collections.USER);
            const docRef = collectionRef.doc(googleUserId);

            return docRef
                .set(<User>{
                    googleEmail: googleEmail,
                    gogleUserId: googleUserId
                })
                .then(result => {
                    if (!result.writeTime) {
                        return Promise.resolve({ error: Errors.ERROR_WHILE_ADD_USER });
                    }

                    return collectionRef
                        .doc(googleUserId)
                        .get()
                        .then(snapshot => {
                            if (!snapshot || snapshot.data()) {
                                return Promise.resolve(<UserAddResponse>{ error: Errors.DEVICE_NOT_FOUND });
                            }

                            return Promise.resolve({ payload: <User>snapshot.data() });
                        })
                        .catch((err: any) => Promise.resolve({ error: err }));
                })
                .catch((err: any) => Promise.resolve({ error: err }));
        })
        .catch((err: any) => Promise.resolve({ error: err }));
};

export interface UserAddRequest {
    googleEmail: string;
    googleToken: string;
}

export interface UserAddResponse extends ServiceResponse<User> { }