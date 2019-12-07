import { ILogging } from "../book/Logging";
import { Collections } from "../entity/Collections";
import { Errors } from "../entity/Errors";
import { Measurement } from "../entity/Measurement";
import { ServiceRequest } from "../entity/ServiceRequest";
import { ServiceResponse } from "../entity/ServiceResponse";
import { devicesSearch, DevicesSearchRequest } from "./DevicesSearch";
import { measurementsSearch, MeasurementSearchRequest, MeasurementSearchResponse } from "./MeasurementsSearch";
import admin = require('firebase-admin');
import Bluebird = require("bluebird");

export const measurementAdd = (logging: ILogging) => (req: MeasurementAddRequest): Promise<MeasurementAddResponse> => {
    if (!req.deviceId || req.deviceId === ''
        || !req.measurements || !req.measurements.length
        || !req.inserted || req.inserted <= 0
    ) {
        logging.debug("measurementAdd", `Check parameter measurements: ${!req.measurements || req.measurements.length}`);
        logging.debug("measurementAdd", `Check parameter deviceId: ${!req.deviceId || req.deviceId === ''}`);
        logging.debug("measurementAdd", `Check parameter inserted: ${!req.inserted || req.inserted <= 0}`);

        return Promise.resolve(<MeasurementAddResponse>{ error: Errors.INVALID_MEASUREMENT_ADD_REQUEST });
    }

    const db = admin.firestore();
    const deviceSearchService = devicesSearch(logging);

    return deviceSearchService(<DevicesSearchRequest>{ deviceId: req.deviceId })
        .then(deviceSearchResponse => {
            if (deviceSearchResponse.error) {
                return Promise.resolve({ error: deviceSearchResponse.error });
            }

            if (!deviceSearchResponse.payload || !deviceSearchResponse.payload.length) {
                return Promise.resolve({ error: Errors.DEVICE_NOT_FOUND });
            }

            return Bluebird
                .map(req.measurements, (m, index) => {
                    if (!m.id || m.id === '') {
                        return Promise.reject(<MeasurementAddResponse>{ error: `${Errors.INVALID_MEASUREMENT} - [${index}]` });
                    }

                    const docRef = db.collection(Collections.MEASUREMENT).doc(m.id);
                    return docRef
                        .set(<Measurement>{
                            measurementId: m.id,
                            deviceId: req.deviceId,
                            type: m.type,
                            value: m.value,
                            inserted: req.inserted,
                        })
                        .then(result => {
                            if (!result.writeTime) {
                                return Promise.reject(<MeasurementAddResponse>{ error: Errors.ERROR_WHILE_ADD_MEASUREMENT });
                            }

                            return measurementsSearch(logging)(<MeasurementSearchRequest>{
                                measurementId: m.id,
                                deviceId: req.deviceId
                            })
                                .then((measurementSearchResponse: MeasurementSearchResponse) => {
                                    if (measurementSearchResponse.error) {
                                        return Promise.reject(<MeasurementAddResponse>{ error: measurementSearchResponse.error });
                                    }

                                    if (!measurementSearchResponse.payload || (measurementSearchResponse.payload && measurementSearchResponse.payload.length !== 1)) {
                                        return Promise.reject(<MeasurementAddResponse>{ error: Errors.MEASUREMENT_NOT_FOUND });
                                    }

                                    return Promise.resolve(<MeasurementAddResponse>{ payload: measurementSearchResponse.payload });
                                });
                        })
                        .catch((err: any) => {
                            logging.error("measurementAdd", `Error while adding measurement: ${err} - [${index}]`);
                            return Promise.resolve({ error: err });
                        });
                }, { concurrency: 2 })
                .then((result: MeasurementAddResponse[]) => Promise.resolve(<MeasurementAddResponse>{
                    payload: result.reduce((acc, curr) => {
                        if (curr.error || !curr.payload || !curr.payload.length) {
                            return acc;
                        }

                        return acc.concat(curr.payload[0]);
                    }, <Measurement[]>[])
                }));
        })
        .catch((err: any) => {
            logging.error("measurementAdd", `Error while adding device device: ${err}`);
            return Promise.resolve({ error: err });
        });
};

export interface MeasurementAddRequest extends ServiceRequest {
    deviceId: string;
    measurements: {
        id: string,
        type: string,
        value: any
    }[];
    inserted: number;
}

export interface MeasurementAddResponse extends ServiceResponse<Measurement[]> {
}