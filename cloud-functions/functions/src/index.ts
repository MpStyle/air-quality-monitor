import functions = require('firebase-functions');
import admin = require('firebase-admin');
import express = require('express');
import { Logging } from './book/Logging';
import { middlewareAuthorization } from './book/MiddlewareAuthorization';
import { deviceSearch } from './service/DeviceSearch';
import { healthCheck } from './service/HealthCheck';
import { measurementSearch } from './service/MeasurementSearch';
import { deviceDataIngestion } from './service/DeviceDataIngestion';

admin.initializeApp(functions.config().firebase);

const cors = require('cors')({ origin: true });
const app = express();
const logging = Logging.get();

app.use(cors);

app.post('/device-search', (req, res) => { middlewareAuthorization(logging)(req.body, deviceSearch(logging)).then(response => res.json(response)).catch(error => { res.send(error) }); });
app.post('/measurement-search', (req, res) => { middlewareAuthorization(logging)(req.body, measurementSearch(logging)).then(response => res.json(response)).catch(error => { res.send(error) }); });
app.get('/health-check', (req, res) => { res.send(healthCheck(logging)()); });
app.get('/device-data-ingestion', (req, res) => { res.send(deviceDataIngestion(logging)(req.body)); });

exports.app = functions.https.onRequest(app);