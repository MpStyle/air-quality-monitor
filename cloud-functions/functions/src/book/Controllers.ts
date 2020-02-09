import express = require('express');
import { Logging } from '../book/Logging';
import { buildErrorResponse } from '../entity/Service';
import { deviceDataIngestion } from '../service/domain/DeviceDataIngestion';
import { healthCheck } from '../service/domain/HealthCheck';
import { userDevicesList } from '../service/domain/UserDevicesList';
import { userLogin } from '../service/domain/UserLogin';
import { userLastReadings as userLastReadings } from '../service/domain/UserLastReadings';
import { userRenewAccessToken } from '../service/domain/UserRenewAccessToken';
import { userRevokeRefreshToken } from '../service/domain/UserRevokeRefreshToken';
import { userTimeRangeReadings } from '../service/domain/UserTimeRangeReadings';
import { userDeviceDelete } from '../service/domain/UserDeviceDelete';

export const controllers = (logging: Logging) => {
    const cors = require('cors')({ origin: true });
    const app = express();

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
    app.post('/user-device-delete', (req, res) => {
        userDeviceDelete(logging)(req.body)
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
    return app;
};