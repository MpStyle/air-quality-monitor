import functions = require('firebase-functions');
import { Collections } from '../entity/Collections';
import { Reading } from '../entity/Reading';
import { deleteOldReadings } from '../trigger/DeleteOldReadings';
import { upsertTimeRangeReadings } from '../trigger/UpsertTimeRangeReadings';
import { Logging } from './Logging';
import Bluebird = require('bluebird');

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