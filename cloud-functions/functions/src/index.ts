import functions = require('firebase-functions');
import admin = require('firebase-admin');
import express = require('express');
import { Logging } from './book/Logging';
import { buildErrorResponse } from './entity/Service';
import { deviceDataIngestion } from './service/DeviceDataIngestion';
import { healthCheck } from './service/HealthCheck';
import { userDevicesList } from './service/UserDevicesList';
import { userLogin } from './service/UserLogin';
import { userLastReadings as userLastReadings } from './service/UserLastReadings';
import { userNewAccessToken as userRenewAccessToken } from './service/UserRenewAccessToken';
import { userRevokeRefreshToken } from './service/UserRevokeRefreshToken';
import { userTimeRangeReadings } from './service/UserTimeRangeReadings';

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
app.post('/user-last-readings', (req, res) => {
    userLastReadings(logging)(req.body)
        .then(data => res.send(data))
        .catch(err => buildErrorResponse(err));
});

app.post('/user-time-range-readings', (req, res) => {
    userTimeRangeReadings(logging)(req.body)
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