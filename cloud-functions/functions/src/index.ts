import * as functions from 'firebase-functions';
import { middlewareAuthorization } from './book/MiddlewareAuthorization';
import { measurementAdd } from './service/MeasurementAdd';
import { measurementSearch } from './service/MeasurementSearch';
import express = require('express');
import cors = require('cors');

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.put('/measurement-add', (req, res) => () => { res.send(middlewareAuthorization(req.body, measurementAdd)); });
app.put('/measurement-search', (req, res) => () => { res.send(middlewareAuthorization(req.body, measurementSearch)); });

// Expose Express API as a single Cloud Function:
export const aircare = functions.https.onRequest(app);