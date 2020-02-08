import { ILogging } from "../../book/Logging";
import { Collections } from "../../entity/Collections";
import { Device } from "../../entity/Device";
import { Errors } from "../../entity/Errors";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import { devicesSearch, DevicesSearchRequest } from "./DevicesSearch";
import admin = require('firebase-admin');

export const deviceAdd = (logging: ILogging): Service<DeviceAddRequest, DeviceAddResponse> => req => {
    if (!req.deviceId || req.deviceId === '') {
        return buildErrorResponse(Errors.INVALID_DEVICE_ADD_REQUEST);
    }

    logging.info("deviceAdd", "Starts");

    const db = admin.firestore();
    const docRef = db.collection(Collections.DEVICE).doc(req.deviceId);
    const deviceSearchService = devicesSearch(logging);

    return deviceSearchService({ deviceId: req.deviceId } as DevicesSearchRequest)
        .then(deviceSearchResponse => {
            if (deviceSearchResponse.error) {
                return buildErrorResponse(deviceSearchResponse.error);
            }

            let device: Partial<Device> = {
                deviceId: req.deviceId,
                inserted: (new Date).getTime()
            };

            if (deviceSearchResponse.payload && deviceSearchResponse.payload.devices && deviceSearchResponse.payload.devices.length) {
                device = deviceSearchResponse.payload.devices[0];
            }

            device.name = req.deviceName || device.name || '';
            device.address = req.deviceAddress || device.address || '';
            device.deviceIP = req.deviceIp || device.deviceIP || '';
            device.enabled = req.enabled ?? device.enabled ?? true;
            device.updated = device.updated || Date.now();

            logging.debug("deviceAdd", `Device to add: ${JSON.stringify(device)}`);

            return docRef
                .set(device)
                .then(result => {
                    logging.debug("deviceAdd", `Add device result: ${JSON.stringify(result.writeTime)}`);
                    if (!result.writeTime) {
                        return buildErrorResponse(Errors.ERROR_WHILE_ADD_DEVICE);
                    }

                    return deviceSearchService(<DevicesSearchRequest>{ deviceId: req.deviceId })
                        .then(response => {
                            if (response.error) {
                                logging.error("deviceAdd", `Error 01: ${response.error}`);
                                return buildErrorResponse(response.error);
                            }

                            if (!response.payload || !response.payload.devices || response.payload.devices.length !== 1) {
                                logging.error("deviceAdd", `Error 02: ${Errors.DEVICE_NOT_FOUND}`);
                                return buildErrorResponse(Errors.DEVICE_NOT_FOUND);
                            }

                            return buildResponse({ device: response.payload.devices[0] });
                        });
                })
                .catch((err: any) => {
                    logging.error("deviceAdd", `Error while adding device: ${err}`);
                    return buildErrorResponse(err);
                });
        });
};

export interface DeviceAddRequest {
    deviceId: string;
    deviceName?: string;
    deviceAddress?: string;
    deviceIp?: string;
    enabled?: boolean;
}

export interface DeviceAddResponse {
    device: Device;
}