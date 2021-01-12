import functions = require('firebase-functions');
import admin = require('firebase-admin');
import { controllers } from './book/Controllers';
import { Logging } from './book/Logging';
import { createReadingTrigger } from './book/Triggers';

admin.initializeApp(functions.config().firebase);
const logging = Logging.get();

exports.app = functions.https.onRequest(controllers(logging));

exports.createReadingTrigger = createReadingTrigger(logging);