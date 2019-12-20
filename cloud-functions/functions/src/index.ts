import functions = require('firebase-functions');
import admin = require('firebase-admin');
import express = require('express');
import { Logging } from './book/Logging';
import { deviceDataIngestion } from './service/DeviceDataIngestion';
import { healthCheck } from './service/HealthCheck';
import { userDevicesSearch } from './service/UserDevicesSearch';
import { userMeasurementsSearch } from './service/UserMeasurementsSearch';
import { buildErrorResponse } from './entity/Service';

admin.initializeApp(functions.config().firebase);

const cors = require('cors')({ origin: true });
const app = express();
const logging = Logging.get();

app.use(cors);

app.get('/health-check', (req, res) => {
    healthCheck(logging)(req.body)
        .then(data => res.send(data))
        .catch(err => buildErrorResponse(err));
});
app.put('/device-data-ingestion', (req, res) => {
    deviceDataIngestion(logging)(req.body)
        .then(data => res.send(data))
        .catch(err => buildErrorResponse(err));
});
app.post('/user-devices-search', (req, res) => {
    userDevicesSearch(logging)(req.body)
        .then(data => res.send(data))
        .catch(err => buildErrorResponse(err));
});
app.post('/user-measurements-search', (req, res) => {
    userMeasurementsSearch(logging)(req.body)
        .then(data => res.send(data))
        .catch(err => buildErrorResponse(err));
});

exports.app = functions.https.onRequest(app);