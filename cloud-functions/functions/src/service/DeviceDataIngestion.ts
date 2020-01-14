import { ILogging } from "../book/Logging";
import { Errors } from "../entity/Errors";
import { buildErrorResponse, Service, buildResponse } from "../entity/Service";
import { deviceAdd, DeviceAddRequest } from "./DeviceAdd";
import { measurementAdd } from "./MeasurementAdd";
import uuid = require("uuid")
import { Scopes } from "../entity/Scopes";
import { deviceAuthorization } from "./DeviceAuthorization";
import { timeRangeMeasurementAdd } from './TimeRangeMeasurementAdd';
import { Granularity } from "../entity/Granularity";
import { MeasurementTypes } from './../entity/MeasurementTypes';

export const deviceDataIngestion = (logging: ILogging): Service<DeviceDataIngestionRequest, {}> => req => {
    if (!req.secretKey || !req.device.id || !req.measurementDate) {
        return buildErrorResponse(Errors.INVALID_DEVICE_DATA_INGESTION_REQUEST);
    }

    logging.info("deviceDataIngestion", "Starts");

    return deviceAuthorization(logging)({ secretKey: req.secretKey })
        .then(deviceAuthorizationResponse => {
            if (deviceAuthorizationResponse.error) {
                return buildErrorResponse(deviceAuthorizationResponse.error);
            }

            if (!deviceAuthorizationResponse.payload) {
                return buildErrorResponse(Errors.DEVICE_UNAUTHORIZED);
            }

            // Only with the write scope permission
            if (!deviceAuthorizationResponse.payload.authorizations.filter(a => a.deviceId === req.device.id && a.scopes.indexOf(Scopes.device_air_quality_data_write) !== -1).length) {
                return buildErrorResponse(Errors.INVALID_AUTORIZATION);
            }

            const measurementAddService = measurementAdd(logging);
            const deviceAddService = deviceAdd(logging);
            const timeRangeMeasurementAddService = timeRangeMeasurementAdd(logging);

            return deviceAddService(<DeviceAddRequest>{ deviceId: req.device.id, deviceName: req.device.name, deviceIp: req.device.ip })
                .then(deviceAddResponse => {
                    if (deviceAddResponse.error) {
                        return buildErrorResponse(deviceAddResponse.error);
                    }

                    if (!deviceAddResponse.payload || !deviceAddResponse.payload.device) {
                        return buildErrorResponse(Errors.ERROR_WHILE_ADD_DEVICE);
                    }

                    return measurementAddService({
                        deviceId: req.device.id, inserted: req.measurementDate, measurements: [
                            {
                                id: uuid.v4(),
                                type: MeasurementTypes.TEMPERATURE,
                                value: req.airData.temperature
                            },
                            {
                                id: uuid.v4(),
                                type: MeasurementTypes.TVOC,
                                value: req.airData.tvoc
                            },
                            {
                                id: uuid.v4(),
                                type: MeasurementTypes.CO2,
                                value: req.airData.co2
                            },
                            {
                                id: uuid.v4(),
                                type: MeasurementTypes.PRESSURE,
                                value: req.airData.pressure
                            },
                            {
                                id: uuid.v4(),
                                type: MeasurementTypes.HUMIDITY,
                                value: req.airData.humidity
                            },
                        ].filter(m => !!m.value)
                    })
                        .then(addMeasurementResponse => {
                            if (deviceAuthorizationResponse.error) {
                                return buildErrorResponse(deviceAuthorizationResponse.error);
                            }

                            if (!addMeasurementResponse.payload) {
                                return buildErrorResponse(Errors.ERROR_WHILE_ADD_MEASUREMENT);
                            }

                            const dateObj = new Date();
                            const month = "" + dateObj.getUTCMonth() + 1;
                            const day = "" + dateObj.getUTCDate();
                            const year = "" + dateObj.getUTCFullYear();

                            return Promise
                                .all([
                                    timeRangeMeasurementAddService({ deviceId: req.device.id, timeRange: year + month + day, type: MeasurementTypes.HUMIDITY, value: req.airData.humidity, granularity: Granularity.daily }),
                                    timeRangeMeasurementAddService({ deviceId: req.device.id, timeRange: year + month, type: MeasurementTypes.HUMIDITY, value: req.airData.humidity, granularity: Granularity.monthly }),
                                    timeRangeMeasurementAddService({ deviceId: req.device.id, timeRange: year, type: MeasurementTypes.HUMIDITY, value: req.airData.humidity, granularity: Granularity.yearly }),

                                    timeRangeMeasurementAddService({ deviceId: req.device.id, timeRange: year + month + day, type: MeasurementTypes.PRESSURE, value: req.airData.pressure, granularity: Granularity.daily }),
                                    timeRangeMeasurementAddService({ deviceId: req.device.id, timeRange: year + month, type: MeasurementTypes.PRESSURE, value: req.airData.pressure, granularity: Granularity.monthly }),
                                    timeRangeMeasurementAddService({ deviceId: req.device.id, timeRange: year, type: MeasurementTypes.PRESSURE, value: req.airData.pressure, granularity: Granularity.yearly }),

                                    timeRangeMeasurementAddService({ deviceId: req.device.id, timeRange: year + month + day, type: MeasurementTypes.CO2, value: req.airData.co2, granularity: Granularity.daily }),
                                    timeRangeMeasurementAddService({ deviceId: req.device.id, timeRange: year + month, type: MeasurementTypes.CO2, value: req.airData.co2, granularity: Granularity.monthly }),
                                    timeRangeMeasurementAddService({ deviceId: req.device.id, timeRange: year, type: MeasurementTypes.CO2, value: req.airData.co2, granularity: Granularity.yearly }),

                                    timeRangeMeasurementAddService({ deviceId: req.device.id, timeRange: year + month + day, type: MeasurementTypes.TVOC, value: req.airData.tvoc, granularity: Granularity.daily }),
                                    timeRangeMeasurementAddService({ deviceId: req.device.id, timeRange: year + month, type: MeasurementTypes.TVOC, value: req.airData.tvoc, granularity: Granularity.monthly }),
                                    timeRangeMeasurementAddService({ deviceId: req.device.id, timeRange: year, type: MeasurementTypes.TVOC, value: req.airData.tvoc, granularity: Granularity.yearly }),

                                    timeRangeMeasurementAddService({ deviceId: req.device.id, timeRange: year + month + day, type: MeasurementTypes.TEMPERATURE, value: req.airData.temperature, granularity: Granularity.daily }),
                                    timeRangeMeasurementAddService({ deviceId: req.device.id, timeRange: year + month, type: MeasurementTypes.TEMPERATURE, value: req.airData.temperature, granularity: Granularity.monthly }),
                                    timeRangeMeasurementAddService({ deviceId: req.device.id, timeRange: year, type: MeasurementTypes.TEMPERATURE, value: req.airData.temperature, granularity: Granularity.yearly }),
                                ])
                                .then(_ => {
                                    return buildResponse({});
                                })
                        })
                        .catch(error => {
                            logging.error("deviceDataIngestion", `Error while adding measurement: ${error}`);
                            return buildErrorResponse(Errors.ERROR_WHILE_ADD_MEASUREMENT);
                        });
                })
                .catch(error => {
                    logging.error("deviceDataIngestion", `Error while adding device: ${error}`);
                    return buildErrorResponse(Errors.ERROR_WHILE_ADD_DEVICE);
                });
        })
        .catch(error => {
            logging.error("deviceDataIngestion", `Not authorized for device: ${error}`);
            return buildErrorResponse(Errors.DEVICE_AUTHORIZATION_ERROR);
        });
}

export interface DeviceDataIngestionRequest {
    secretKey: string,
    device: {
        id: string,
        name: string,
        ip: string
    },
    airData: {
        temperature: number
        tvoc: number
        co2: number
        pressure: number
        humidity: number
    },
    measurementDate: number
}
