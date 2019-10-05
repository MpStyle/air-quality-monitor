import * as functions from 'firebase-functions';
import { deviceAdd } from './service/DeviceAdd';
import { deviceDelete } from './service/DeviceDelete';
import { deviceEdit } from './service/DeviceEdit';
import { deviceSearch } from './service/DeviceSearch';
import { userAdd } from './service/UserAdd';
import express = require('express');
import cors = require('cors');

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// build multiple CRUD interfaces:
app.put('/user-add', (req, res) => () => { res.send(userAdd(req.body)); });
app.put('/device-add', (req, res) => () => { res.send(deviceAdd(req.body)); });
app.post('/device-edit', (req, res) => () => { res.send(deviceEdit(req.body)); });
app.post('/device-search', (req, res) => () => { res.send(deviceSearch(req.body)); });
app.delete('/device-delete', (req, res) => () => { res.send(deviceDelete(req.body)); });
app.put('/data-add', (req, res) => () => { res.send(dataAdd(req.body)); });
app.post('/data-search', (req, res) => () => { res.send(dataSearch(req.body)); });
app.delete('/data-delete', (req, res) => () => { res.send(dataDelete(req.body)); });
app.post('/device-token-update', (req, res) => () => { res.send(deviceTokenUpdate(req.body)); });

// Expose Express API as a single Cloud Function:
export const aircare = functions.https.onRequest(app);