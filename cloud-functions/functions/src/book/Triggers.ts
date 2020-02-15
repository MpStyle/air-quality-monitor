import functions = require('firebase-functions');
import { Collections } from '../entity/Collections';
import { LoginToken } from '../entity/LoginToken';
import { loginTokenDelete } from '../service/crud/LoginTokenDelete';
import { loginTokensSearch } from '../service/crud/LoginTokensSearch';
import { Logging } from './Logging';
import Bluebird = require('bluebird');
import { Reading } from '../entity/Reading';
import { readingsSearch } from '../service/crud/ReadingsSearch';
import { readingDelete } from '../service/crud/ReadingDelete';

export const createLoginTokenTrigger = (logging: Logging) => {
    return functions.firestore
        .document(`${Collections.LOGIN_TOKEN}/{expiredToken}`)
        .onCreate((snap, _) => {
            logging.info("createLoginTokenTrigger", "Starts");

            const newValue = snap.data() as LoginToken;
            const expiredBefore = newValue.expiredAt - (24 * 60 * 60 * 1000);

            logging.info("createLoginTokenTrigger", `expiredBefore: ${expiredBefore}`);

            return loginTokensSearch(logging)({ expiredBefore: expiredBefore })
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
                        logging.info("createLoginTokenTrigger", `Removing refresh token ${loginToken.refreshToken}...`);
                        return loginTokenDelete(logging)({ refreshToken: loginToken.refreshToken });
                    }, { concurrency: 5 });
                });
        })
};

export const createReadingTrigger = (logging: Logging) => {
    return functions.firestore
        .document(`${Collections.READING}/{readingId}`)
        .onCreate((snap, _) => {
            logging.info("createReadingTrigger", "Starts");

            const newValue = snap.data() as Reading;
            const insertedBefore = newValue.inserted - (24 * 60 * 60 * 1000);

            logging.info("createReadingTrigger", `insertedBefore: ${insertedBefore}`);

            return readingsSearch(logging)({ insertedBefore: insertedBefore })
                .then(response => {
                    if (response.error) {
                        logging.error("createReadingTrigger", `readingsSearch - ${response.error}`);
                        return;
                    }

                    if (!response.payload || !response.payload.readings) {
                        logging.error("createReadingTrigger", `readingsSearch`);
                        return;
                    }

                    return Bluebird.map(response.payload.readings, (reading) => {
                        logging.info("createReadingTrigger", `Removing reading ${reading.readingId}...`);
                        return readingDelete(logging)({ readingId: reading.readingId });
                    }, { concurrency: 5 });
                });
        })
};