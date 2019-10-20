import functions = require('firebase-functions');
import admin = require('firebase-admin');
import express = require('express');
import { Logging } from './book/Logging';
import { middlewareAuthorization } from './book/MiddlewareAuthorization';
import { deviceAdd } from './service/DeviceAdd';
import { deviceSearch } from './service/DeviceSearch';
import { healthCheck } from './service/HealthCheck';
import { measurementAdd } from './service/MeasurementAdd';
import { measurementSearch } from './service/MeasurementSearch';

admin.initializeApp(functions.config().firebase);

const cors = require('cors')({ origin: true });
const app = express();
const logging = Logging.get();

app.use(cors);

app.put('/device-add', (req, res) => { middlewareAuthorization(logging)(req.body, deviceAdd(logging)).then(response => res.json(response)).catch(error => { res.send(error) }); });
app.post('/device-search', (req, res) => { middlewareAuthorization(logging)(req.body, deviceSearch(logging)).then(response => res.json(response)).catch(error => { res.send(error) }); });
app.put('/measurement-add', (req, res) => { middlewareAuthorization(logging)(req.body, measurementAdd(logging)).then(response => res.json(response)).catch(error => { res.send(error) }); });
app.post('/measurement-search', (req, res) => { middlewareAuthorization(logging)(req.body, measurementSearch(logging)).then(response => res.json(response)).catch(error => { res.send(error) }); });
app.get('/health-check', (req, res) => { res.send(healthCheck(logging)()); });

exports.app = functions.https.onRequest(app);