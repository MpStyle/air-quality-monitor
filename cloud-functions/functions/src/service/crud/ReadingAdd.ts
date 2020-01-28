import { ILogging } from "../../book/Logging";
import { Collections } from "../../entity/Collections";
import { Errors } from "../../entity/Errors";
import { Reading } from "../../entity/Reading";
import { buildErrorResponse, buildResponse, Service, ServiceResponse } from "../../entity/Service";
import { devicesSearch, DevicesSearchRequest } from "./DevicesSearch";
import { readingsSearch } from "./ReadingsSearch";
import admin = require('firebase-admin');
import Bluebird = require("bluebird");

export const readingAdd = (logging: ILogging): Service<ReadingAddRequest, ReadingAddResponse> => req => {
    if (!req.deviceId || req.deviceId === ''
        || !req.readings || !req.readings.length
        || !req.inserted || req.inserted <= 0
    ) {
        logging.debug("readingAdd", `Check parameter readings: ${!req.readings || req.readings.length}`);
        logging.debug("readingAdd", `Check parameter deviceId: ${!req.deviceId || req.deviceId === ''}`);
        logging.debug("readingAdd", `Check parameter inserted: ${!req.inserted || req.inserted <= 0}`);

        return buildErrorResponse(Errors.INVALID_READING_ADD_REQUEST);
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
                .map(req.readings, (m, index): Promise<ServiceResponse<ReadingAddResponse>> => {
                    if (!m.id || m.id === '') {
                        logging.error("readingAdd", `Error while adding reading ${index}`);
                        return buildErrorResponse(Errors.INVALID_READING);
                    }

                    const docRef = db.collection(Collections.READING).doc(m.id);
                    return docRef
                        .set(<Reading>{
                            readingId: m.id,
                            deviceId: req.deviceId,
                            type: m.type,
                            value: m.value,
                            inserted: req.inserted,
                        })
                        .then(result => {
                            if (!result.writeTime) {
                                return buildErrorResponse(Errors.ERROR_WHILE_ADD_READING);
                            }

                            return readingsSearch(logging)({
                                readingId: m.id,
                                deviceId: req.deviceId
                            })
                                .then(readingSearchResponse => {
                                    if (readingSearchResponse.error) {
                                        return buildErrorResponse(readingSearchResponse.error);
                                    }

                                    if (!readingSearchResponse.payload || !readingSearchResponse.payload.readings || readingSearchResponse.payload.readings.length !== 1) {
                                        return buildErrorResponse(Errors.READING_NOT_FOUND);
                                    }

                                    return buildResponse({ readings: readingSearchResponse.payload.readings });
                                });
                        })
                        .catch((err: any) => {
                            logging.error("readingAdd", `Error while adding reading: ${err} - [${index}]`);
                            return Promise.resolve({ error: err });
                        });
                }, { concurrency: 2 })
                .then(result => {
                    return buildResponse({
                        readings: result.reduce((acc, curr) => {
                            if (curr.error || !curr.payload || !curr.payload.readings || !curr.payload.readings.length) {
                                return acc;
                            }

                            return acc.concat(curr.payload.readings[0]);
                        }, <Reading[]>[])
                    });
                });
        })
        .catch((err: any) => {
            logging.error("readingAdd", `Error while adding device device: ${err}`);
            return Promise.resolve({ error: err });
        });
};

export interface ReadingAddRequest {
    deviceId: string;
    readings: {
        id: string,
        type: string,
        value: any
    }[];
    inserted: number;
}

export interface ReadingAddResponse {
    readings: Reading[];
}