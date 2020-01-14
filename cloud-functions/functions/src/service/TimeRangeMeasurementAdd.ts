import { ILogging } from "../book/Logging";
import { Collections } from "../entity/Collections";
import { Errors } from "../entity/Errors";
import { Measurement } from "../entity/Measurement";
import { buildErrorResponse, buildResponse, Service } from "../entity/Service";
import { TimeRangeMeasurement } from './../entity/TimeRangeMeasurement';
import { devicesSearch, DevicesSearchRequest } from "./DevicesSearch";
import { TimeRangeMeasurementSearchRequest, timeRangeMeasurementsSearch } from './TimeRangeMeasurementsSearch';
import admin = require('firebase-admin');
import { Granularity } from "../entity/Granularity";

export const timeRangeMeasurementAdd = (logging: ILogging): Service<TimeRangeMeasurementAddRequest, TimeRangeMeasurementAddResponse> => req => {
    if (!req.deviceId || req.deviceId === ''
        || !req.type || req.type === ''
        || req.value === null || req.value === undefined
        || !req.timeRange || req.timeRange === ''
        || req.granularity === null || req.granularity === undefined
    ) {
        return buildErrorResponse(Errors.INVALID_MEASUREMENT_ADD_REQUEST);
    }

    logging.info("timeRangeMeasurementAdd", "Starts");

    const db = admin.firestore();
    const deviceSearchService = devicesSearch(logging);
    const timeRangeMeasurementsSearchService = timeRangeMeasurementsSearch(logging);

    return deviceSearchService(<DevicesSearchRequest>{ deviceId: req.deviceId })
        .then(deviceSearchResponse => {
            if (deviceSearchResponse.error) {
                return buildErrorResponse(deviceSearchResponse.error);
            }

            if (!deviceSearchResponse.payload || !deviceSearchResponse.payload.devices || !deviceSearchResponse.payload.devices.length) {
                return buildErrorResponse(Errors.DEVICE_NOT_FOUND);
            }

            return timeRangeMeasurementsSearchService(<TimeRangeMeasurementSearchRequest>{
                timeRange: req.timeRange,
                deviceId: req.deviceId,
                type: req.type
            })
                .then(response => {
                    if (response.error) {
                        return buildErrorResponse(response.error);
                    }

                    if (!response.payload || !response.payload.timeRangeMeasurements) {
                        return buildErrorResponse(Errors.TIME_RANGE_MEASUREMENT_NOT_FOUND);
                    }

                    let measurement = response.payload.timeRangeMeasurements[0] ?? <TimeRangeMeasurement>{
                        counter: 0,
                        deviceId: req.deviceId,
                        timeRange: req.timeRange,
                        type: req.type,
                        value: 0,
                        granularity: req.granularity
                    };
                    measurement = { ...measurement, value: measurement.value + req.value, counter: measurement.counter + 1 };

                    const docRef = db.collection(Collections.TIME_RANGE_MEASUREMENT).doc(`${req.timeRange}_${req.type}_${req.deviceId}`);
                    return docRef
                        .set(measurement)
                        .then(result => {
                            if (!result.writeTime) {
                                return buildErrorResponse(Errors.ERROR_WHILE_ADD_TIME_RANGE_MEASUREMENT);
                            }

                            return timeRangeMeasurementsSearchService({
                                timeRange: req.timeRange
                            })
                                .then(measurementSearchResponse => {
                                    if (measurementSearchResponse.error) {
                                        return buildErrorResponse(measurementSearchResponse.error);
                                    }

                                    if (!measurementSearchResponse.payload || !measurementSearchResponse.payload.timeRangeMeasurements || measurementSearchResponse.payload.timeRangeMeasurements.length !== 1) {
                                        return buildErrorResponse(Errors.TIME_RANGE_MEASUREMENT_NOT_FOUND);
                                    }

                                    return buildResponse({ measurements: measurementSearchResponse.payload.timeRangeMeasurements });
                                });
                        })
                        .catch((err: any) => {
                            logging.error("timeRangeMeasurementAdd", `Error while adding time range measurement (${req.timeRange}-${req.type}-${req.deviceId}): ${err}]`);
                            return Promise.resolve({ error: err });
                        });
                });
        })
        .catch((err: any) => {
            logging.error("timeRangeMeasurementAdd", `Error while adding time range measurement: ${err}`);
            return Promise.resolve({ error: err });
        });
};

export interface TimeRangeMeasurementAddRequest {
    deviceId: string,
    type: string,
    value: number,
    timeRange: string
    granularity: Granularity
}

export interface TimeRangeMeasurementAddResponse {
    measurements: Measurement[];
}