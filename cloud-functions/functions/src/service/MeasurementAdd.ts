import { ILogging } from "../book/Logging";
import { Collections } from "../entity/Collections";
import { Errors } from "../entity/Errors";
import { Measurement } from "../entity/Measurement";
import { buildErrorResponse, buildResponse, Service, ServiceResponse } from "../entity/Service";
import { devicesSearch, DevicesSearchRequest } from "./DevicesSearch";
import { measurementsSearch } from "./MeasurementsSearch";
import admin = require('firebase-admin');
import Bluebird = require("bluebird");

export const measurementAdd = (logging: ILogging): Service<MeasurementAddRequest, MeasurementAddResponse> => req => {
    if (!req.deviceId || req.deviceId === ''
        || !req.measurements || !req.measurements.length
        || !req.inserted || req.inserted <= 0
    ) {
        logging.debug("measurementAdd", `Check parameter measurements: ${!req.measurements || req.measurements.length}`);
        logging.debug("measurementAdd", `Check parameter deviceId: ${!req.deviceId || req.deviceId === ''}`);
        logging.debug("measurementAdd", `Check parameter inserted: ${!req.inserted || req.inserted <= 0}`);

        return buildErrorResponse(Errors.INVALID_MEASUREMENT_ADD_REQUEST);
    }

    const db = admin.firestore();
    const deviceSearchService = devicesSearch(logging);

    return deviceSearchService(<DevicesSearchRequest>{ deviceId: req.deviceId })
        .then(deviceSearchResponse => {
            if (deviceSearchResponse.error) {
                return buildErrorResponse(deviceSearchResponse.error);
            }

            if (!deviceSearchResponse.payload || !deviceSearchResponse.payload || !deviceSearchResponse.payload.devices.length) {
                return buildErrorResponse(Errors.DEVICE_NOT_FOUND);
            }

            return Bluebird
                .map(req.measurements, (m, index): Promise<ServiceResponse<MeasurementAddResponse>> => {
                    if (!m.id || m.id === '') {
                        return buildErrorResponse(`${Errors.INVALID_MEASUREMENT} - [${index}]`);
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
                                return buildErrorResponse(Errors.ERROR_WHILE_ADD_MEASUREMENT);
                            }

                            return measurementsSearch(logging)({
                                measurementId: m.id,
                                deviceId: req.deviceId
                            })
                                .then(measurementSearchResponse => {
                                    if (measurementSearchResponse.error) {
                                        return buildErrorResponse(measurementSearchResponse.error);
                                    }

                                    if (!measurementSearchResponse.payload || !measurementSearchResponse.payload.measurements || measurementSearchResponse.payload.measurements.length !== 1) {
                                        return buildErrorResponse(Errors.MEASUREMENT_NOT_FOUND);
                                    }

                                    return buildResponse({ measurements: measurementSearchResponse.payload.measurements });
                                });
                        })
                        .catch((err: any) => {
                            logging.error("measurementAdd", `Error while adding measurement: ${err} - [${index}]`);
                            return Promise.resolve({ error: err });
                        });
                }, { concurrency: 2 })
                .then(result => {
                    return buildResponse({
                        measurements: result.reduce((acc, curr) => {
                            if (curr.error || !curr.payload || !curr.payload.measurements || !curr.payload.measurements.length) {
                                return acc;
                            }

                            return acc.concat(curr.payload.measurements[0]);
                        }, <Measurement[]>[])
                    });
                });
        })
        .catch((err: any) => {
            logging.error("measurementAdd", `Error while adding device device: ${err}`);
            return Promise.resolve({ error: err });
        });
};

export interface MeasurementAddRequest {
    deviceId: string;
    measurements: {
        id: string,
        type: string,
        value: any
    }[];
    inserted: number;
}

export interface MeasurementAddResponse {
    measurements: Measurement[];
}