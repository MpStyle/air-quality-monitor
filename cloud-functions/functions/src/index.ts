import functions = require('firebase-functions');
import admin = require('firebase-admin');
import { controllers } from './book/Controllers';

admin.initializeApp(functions.config().firebase);

exports.app = functions.https.onRequest(controllers);