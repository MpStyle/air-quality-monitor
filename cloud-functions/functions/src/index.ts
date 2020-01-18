import functions = require('firebase-functions');
import admin = require('firebase-admin');
import express = require('express');
import { Logging } from './book/Logging';
import { buildErrorResponse } from './entity/Service';
import { deviceDataIngestion } from './service/DeviceDataIngestion';
import { healthCheck } from './service/HealthCheck';
import { userDevicesList } from './service/UserDevicesList';
import { userLogin } from './service/UserLogin';
import { userLastMeasurements as userLastMeasurements } from './service/UserLastMeasurements';
import { userNewAccessToken as userRenewAccessToken } from './service/UserRenewAccessToken';
import { userRevokeRefreshToken } from './service/UserRevokeRefreshToken';
import { userTimeRangeMeasurements } from './service/UserTimeRangeMeasurements';

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

// Device - To add data
app.put('/device-data-ingestion', (req, res) => {
    deviceDataIngestion(logging)(req.body)
        .then(data => res.send(data))
        .catch(err => buildErrorResponse(err));
});

// User - To retrieve data
app.post('/user-devices-list', (req, res) => {
    userDevicesList(logging)(req.body)
        .then(data => res.send(data))
        .catch(err => buildErrorResponse(err));
});
app.post('/user-last-measurements', (req, res) => {
    userLastMeasurements(logging)(req.body)
        .then(data => res.send(data))
        .catch(err => buildErrorResponse(err));
});

app.post('/user-time-range-measurements', (req, res) => {
    userTimeRangeMeasurements(logging)(req.body)
        .then(data => res.send(data))
        .catch(err => buildErrorResponse(err));
});

// User - Authentication/Authorization
app.post('/user-login', (req, res) => {
    userLogin(logging)(req.body)
        .then(data => res.send(data))
        .catch(err => buildErrorResponse(err));
});
app.post('/user-renew-access-token', (req, res) => {
    userRenewAccessToken(logging)(req.body)
        .then(data => res.send(data))
        .catch(err => buildErrorResponse(err));
});
app.post('/user-revoke-refresh-token', (req, res) => {
    userRevokeRefreshToken(logging)(req.body)
        .then(data => res.send(data))
        .catch(err => buildErrorResponse(err));
});

exports.app = functions.https.onRequest(app);