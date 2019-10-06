import functions = require('firebase-functions');
import admin = require('firebase-admin');
import express = require('express');
import { middlewareAuthorization } from './book/MiddlewareAuthorization';
import { measurementAdd } from './service/MeasurementAdd';
import { measurementSearch } from './service/MeasurementSearch';
import { healthCheck } from './service/HealthCheck';

admin.initializeApp();

const cors = require('cors')({ origin: true });
const app = express();

app.use(cors);

app.put('/measurement-add', (req, res) => { middlewareAuthorization(req.body, measurementAdd).then(response => res.json(response)).catch(error => { res.send(error) }); });
app.post('/measurement-search', (req, res) => { res.send(middlewareAuthorization(req.body, measurementSearch)); });
app.get('/health-check', (req, res) => { res.send(healthCheck()); });

exports.app = functions.https.onRequest(app);