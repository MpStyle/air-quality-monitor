import { Measurement } from "../entity/Measurement";
import { ServiceResponse } from "../entity/ServiceResponse";
import { ServiceAsync } from "../entity/Service";
import { Errors } from "../entity/Errors";
import admin = require('firebase-admin');
import functions = require('firebase-functions');
import { Collections } from "../entity/Collections";
import { measurementSearch, MeasurementSearchRequest, MeasurementSearchResponse } from "./MeasurementSearch";
import { deviceAdd, DeviceAddRequest } from "./DeviceAdd";

export const measurementAdd: ServiceAsync<MeasurementAddRequest, Measurement> = (req: MeasurementAddRequest): Promise<MeasurementAddResponse> => {
    if (!req.measurementId || req.measurementId === ''
        || !req.deviceId || req.deviceId === ''
        || !req.type || req.type === ''
        || !req.value || req.value === ''
        || !req.inserted || req.inserted > 0
    ) {
        return Promise.resolve(<MeasurementAddResponse>{ error: Errors.MEASUREMENT_ADD_REQUEST });
    }

    admin.initializeApp(functions.config().firebase);

    const db = admin.firestore();
    const docRef = db.collection(Collections.MEASUREMENT).doc(req.measurementId);

    return deviceAdd(<DeviceAddRequest>{ deviceId: req.deviceId })
        .then(deviceAddResponse => {
            if (deviceAddResponse.error) {
                return Promise.resolve({ error: deviceAddResponse.error });
            }

            return docRef
                .set(<Measurement>{
                    measurementId: req.measurementId,
                    deviceId: req.deviceId,
                    type: req.type,
                    value: req.value,
                    inserted: req.inserted,
                })
                .then(result => {
                    if (!result.writeTime) {
                        return Promise.resolve({ error: Errors.ERROR_WHILE_ADD_DEVICE });
                    }

                    return measurementSearch(<MeasurementSearchRequest>{ measurementId: req.measurementId })
                        .then((measurementSearchResponse: MeasurementSearchResponse) => {
                            if (measurementSearchResponse.error) {
                                return Promise.resolve(<MeasurementAddResponse>{ error: measurementSearchResponse.error });
                            }

                            if (!measurementSearchResponse.payload || (measurementSearchResponse.payload && measurementSearchResponse.payload.length !== 1)) {
                                return Promise.resolve(<MeasurementAddResponse>{ error: Errors.DEVICE_NOT_FOUND });
                            }

                            return Promise.resolve(<MeasurementAddResponse>{ device: measurementSearchResponse.payload[0] });
                        });
                })
                .catch((err: any) => {
                    return Promise.resolve({ error: err });
                });
        });
};

export interface MeasurementAddRequest {
    measurementId: string;
    deviceId: string;
    type: string;
    value: string;
    inserted: number
}

export interface MeasurementAddResponse extends ServiceResponse<Measurement> {
}