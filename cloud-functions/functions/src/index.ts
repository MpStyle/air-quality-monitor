import * as functions from 'firebase-functions';
import express = require('express');
import cors = require('cors');
import { measurementAdd } from './service/MeasurementAdd';
import { measurementSearch } from './service/MeasurementSearch';

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// build multiple CRUD interfaces:
app.put('/measurement-add', (req, res) => () => { res.send(measurementAdd(req.body)); });
app.put('/measurement-search', (req, res) => () => { res.send(measurementSearch(req.body)); });

// Expose Express API as a single Cloud Function:
export const aircare = functions.https.onRequest(app);