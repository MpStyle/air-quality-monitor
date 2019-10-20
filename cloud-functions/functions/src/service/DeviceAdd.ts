import { ILogging } from "../book/Logging";
import { Collections } from "../entity/Collections";
import { Device } from "../entity/Device";
import { Errors } from "../entity/Errors";
import { ServiceRequest } from "../entity/ServiceRequest";
import { ServiceResponse } from "../entity/ServiceResponse";
import { deviceSearch, DeviceSearchRequest, DeviceSearchResponse } from "./DeviceSearch";
import admin = require('firebase-admin');

export const deviceAdd = (logging: ILogging) => (req: DeviceAddRequest): Promise<DeviceAddResponse> => {
    if (!req.deviceId || req.deviceId === '') {
        return Promise.resolve(<DeviceAddResponse>{ error: Errors.INVALID_DEVICE_ADD_REQUEST });
    }

    logging.info("deviceAdd", "Starts");

    const db = admin.firestore();
    const docRef = db.collection(Collections.DEVICE).doc(req.deviceId);
    const deviceSearchService = deviceSearch(logging);

    return deviceSearchService({ deviceId: req.deviceId })
        .then(deviceSearchResponse => {
            if (deviceSearchResponse.error) {
                return Promise.resolve(<DeviceAddResponse>{ error: deviceSearchResponse.error });
            }

            const device = <Device>{
                deviceId: req.deviceId,
                name: req.deviceName || '',
                address: req.deviceAddress || '',
                inserted: (new Date).getTime(),
            };

            if (deviceSearchResponse.payload && deviceSearchResponse.payload.length) {
                device.inserted = deviceSearchResponse.payload[0].inserted;
            }

            if (!req.update && deviceSearchResponse.payload && deviceSearchResponse.payload.length) {
                device.name = deviceSearchResponse.payload[0].name;
                device.address = deviceSearchResponse.payload[0].address;
            }

            logging.debug("deviceAdd", `Device to add: ${JSON.stringify(device)}`);

            return docRef
                .set(device)
                .then(result => {
                    logging.debug("deviceAdd", `Add device result: ${JSON.stringify(result.writeTime)}`);
                    if (!result.writeTime) {

                        return Promise.resolve({ error: Errors.ERROR_WHILE_ADD_DEVICE });
                    }

                    return deviceSearchService(<DeviceSearchRequest>{ deviceId: req.deviceId })
                        .then((response: DeviceSearchResponse) => {
                            if (response.error) {
                                logging.error("deviceAdd", `Error 01: ${response.error}`);
                                return Promise.resolve(<DeviceAddResponse>{ error: response.error });
                            }

                            if (!response.payload || (response.payload && response.payload.length !== 1)) {
                                logging.error("deviceAdd", `Error 02: ${Errors.DEVICE_NOT_FOUND}`);
                                return Promise.resolve(<DeviceAddResponse>{ error: Errors.DEVICE_NOT_FOUND });
                            }

                            return Promise.resolve(<DeviceAddResponse>{ device: response.payload[0] });
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
    update: boolean;
}

export interface DeviceAddResponse extends ServiceResponse<Device> {
}