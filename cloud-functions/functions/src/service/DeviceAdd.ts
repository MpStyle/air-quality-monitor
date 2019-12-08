import { ILogging } from "../book/Logging";
import { Collections } from "../entity/Collections";
import { Device } from "../entity/Device";
import { Errors } from "../entity/Errors";
import { ServiceRequest } from "../entity/ServiceRequest";
import { ServiceResponse } from "../entity/ServiceResponse";
import { devicesSearch, DevicesSearchRequest, DevicesSearchResponse } from "./DevicesSearch";
import admin = require('firebase-admin');

export const deviceAdd = (logging: ILogging) => (req: DeviceAddRequest): Promise<DeviceAddResponse> => {
    if (!req.deviceId || req.deviceId === '') {
        return Promise.resolve(<DeviceAddResponse>{ error: Errors.INVALID_DEVICE_ADD_REQUEST });
    }

    logging.info("deviceAdd", "Starts");

    const db = admin.firestore();
    const docRef = db.collection(Collections.DEVICE).doc(req.deviceId);
    const deviceSearchService = devicesSearch(logging);

    return deviceSearchService({ deviceId: req.deviceId } as DevicesSearchRequest)
        .then(deviceSearchResponse => {
            if (deviceSearchResponse.error) {
                return Promise.resolve(<DeviceAddResponse>{ error: deviceSearchResponse.error });
            }

            let device: Partial<Device> = {
                deviceId: req.deviceId,
                inserted: (new Date).getTime()
            };

            if (deviceSearchResponse.payload && deviceSearchResponse.payload.length) {
                device = deviceSearchResponse.payload[0];
            }

            device.name = req.deviceName || device.name || '';
            device.address = req.deviceAddress || device.address || '';
            device.deviceIP = req.deviceIp || device.deviceIP || '';

            logging.debug("deviceAdd", `Device to add: ${JSON.stringify(device)}`);

            return docRef
                .set(device)
                .then(result => {
                    logging.debug("deviceAdd", `Add device result: ${JSON.stringify(result.writeTime)}`);
                    if (!result.writeTime) {

                        return Promise.resolve({ error: Errors.ERROR_WHILE_ADD_DEVICE });
                    }

                    return deviceSearchService(<DevicesSearchRequest>{ deviceId: req.deviceId })
                        .then((response: DevicesSearchResponse) => {
                            if (response.error) {
                                logging.error("deviceAdd", `Error 01: ${response.error}`);
                                return Promise.resolve(<DeviceAddResponse>{ error: response.error });
                            }

                            if (!response.payload || (response.payload && response.payload.length !== 1)) {
                                logging.error("deviceAdd", `Error 02: ${Errors.DEVICE_NOT_FOUND}`);
                                return Promise.resolve(<DeviceAddResponse>{ error: Errors.DEVICE_NOT_FOUND });
                            }

                            return Promise.resolve(<DeviceAddResponse>{ payload: response.payload[0] });
                        });
                })
                .catch((err: any) => {
                    logging.error("deviceAdd", `Error while adding device: ${err}`);
                    return Promise.resolve({ error: err });
                });
        });
};

export interface DeviceAddRequest extends ServiceRequest {
    deviceId: string;
    deviceName: string;
    deviceAddress: string;
    deviceIp: string;
}

export interface DeviceAddResponse extends ServiceResponse<Device> {
}