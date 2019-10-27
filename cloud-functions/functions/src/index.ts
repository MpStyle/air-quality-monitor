import functions = require('firebase-functions');
import admin = require('firebase-admin');
import express = require('express');
import { Logging } from './book/Logging';
import { deviceDataIngestion } from './service/DeviceDataIngestion';
import { deviceSearch } from './service/DeviceSearch';
import { healthCheck } from './service/HealthCheck';
import { measurementSearch } from './service/MeasurementSearch';

admin.initializeApp(functions.config().firebase);

const cors = require('cors')({ origin: true });
const app = express();
const logging = Logging.get();

app.use(cors);

app.post('/device-search', (req, res) => { res.send(deviceSearch(logging)(req.body)); });
app.post('/measurement-search', (req, res) => { res.send(measurementSearch(logging)(req.body)); });
app.get('/health-check', (req, res) => { res.send(healthCheck(logging)()); });
app.get('/device-data-ingestion', (req, res) => { res.send(deviceDataIngestion(logging)(req.body)); });

exports.app = functions.https.onRequest(app);