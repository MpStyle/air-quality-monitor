import functions = require('firebase-functions');
import { Collections } from '../entity/Collections';
import { LoginToken } from '../entity/LoginToken';
import { loginTokenDelete } from '../service/crud/LoginTokenDelete';
import { loginTokenSearch } from '../service/crud/LoginTokenSearch';
import { Logging } from './Logging';
import Bluebird = require('bluebird');

export const createLoginTokenTrigger = (logging: Logging) => {
    return functions.firestore
        .document(`${Collections.LOGIN_TOKEN}/{expiredToken}`)
        .onCreate((snap, _) => {
            logging.info("createLoginTokenTrigger", "Starts");

            const newValue = snap.data() as LoginToken;
            const expiredBefore = newValue.expiredAt - (24 * 60 * 60 * 1000);

            logging.info("createLoginTokenTrigger", `expiredBefore: ${expiredBefore}`);

            return loginTokenSearch(logging)({ expiredBefore: expiredBefore })
                .then(response => {
                    if (response.error) {
                        logging.error("createLoginTokenTrigger", `loginTokenSearch - ${response.error}`);
                        return;
                    }

                    if (!response.payload || !response.payload.loginTokens) {
                        logging.error("createLoginTokenTrigger", `loginTokenSearch`);
                        return;
                    }

                    return Bluebird.map(response.payload.loginTokens, (loginToken) => {
                        logging.error("createLoginTokenTrigger", `Removing refresh token ${loginToken.refreshToken}...`);
                        return loginTokenDelete(logging)({ refreshToken: loginToken.refreshToken });
                    }, { concurrency: 5 });
                });
        })
};