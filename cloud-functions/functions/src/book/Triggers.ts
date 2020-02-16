import functions = require('firebase-functions');
import { Collections } from '../entity/Collections';
import { LoginToken } from '../entity/LoginToken';
import { Reading } from '../entity/Reading';
import { deleteOldLoginTokens } from '../trigger/DeleteOldLoginTokens';
import { deleteOldReadings } from '../trigger/DeleteOldReadings';
import { Logging } from './Logging';
import Bluebird = require('bluebird');
import { upsertTimeRangeReadings } from '../trigger/UpsertTimeRangeReadings';

export const createLoginTokenTrigger = (logging: Logging) => {
    return functions.firestore
        .document(`${Collections.LOGIN_TOKEN}/{loginTokenId}`)
        .onCreate((snap, _) => {
            logging.info("createLoginTokenTrigger", "Starts");

            const newValue = snap.data() as LoginToken;

            return deleteOldLoginTokens(logging)({ lastExpiredAt: newValue.expiredAt });
        })
};

export const createReadingTrigger = (logging: Logging) => {
    return functions.firestore
        .document(`${Collections.READING}/{readingId}`)
        .onCreate((snap, _) => {
            logging.info("createReadingTrigger", "Starts");

            const newValue = snap.data() as Reading;

            return Bluebird.all([
                deleteOldReadings(logging)({ lastInserted: newValue.inserted }),
                upsertTimeRangeReadings(logging)({ reading: newValue })
            ]);
        })
};