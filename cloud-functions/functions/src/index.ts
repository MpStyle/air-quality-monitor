import functions = require('firebase-functions');
import admin = require('firebase-admin');
import express = require('express');
import { Logging } from './book/Logging';
import { deviceDataIngestion } from './service/DeviceDataIngestion';
import { healthCheck } from './service/HealthCheck';
import { userDeviceSearch } from './service/UserDeviceSearch';
import { userMeasurementSearch } from './service/UserMeasurementSearch';

admin.initializeApp(functions.config().firebase);

const cors = require('cors')({ origin: true });
const app = express();
const logging = Logging.get();

app.use(cors);

app.get('/health-check', (req, res) => { res.send(healthCheck(logging)()); });
app.put('/device-data-ingestion', (req, res) => { res.send(deviceDataIngestion(logging)(req.body)); });
app.post('/user-device-search', (req, res) => { res.send(userDeviceSearch(logging)(req.body)); });
app.post('/user-measurement-search', (req, res) => { res.send(userMeasurementSearch(logging)(req.body)); });

exports.app = functions.https.onRequest(app);