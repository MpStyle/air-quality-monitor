import { ILogging } from "../../book/Logging";
import { Errors } from "../../entity/Errors";
import { buildErrorResponse, Service, buildResponse } from "../../entity/Service";
import { deviceAdd, DeviceAddRequest } from "../crud/DeviceAdd";
import { readingAdd } from "../crud/ReadingAdd";
import uuid = require("uuid")
import { Scopes } from "../../entity/Scopes";
import { deviceAuthorization } from "./DeviceAuthorization";
import { timeRangeReadingAdd } from '../crud/TimeRangeReadingAdd';
import { Granularity } from "../../entity/Granularity";
import { ReadingTypes } from '../../entity/ReadingTypes';
import { StringUtils } from "../../book/StringUtils";
import Bluebird = require("bluebird");

export const deviceDataIngestion = (logging: ILogging): Service<DeviceDataIngestionRequest, {}> => req => {
    if (!req.secretKey || !req.device.id || !req.readingDate) {
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

            const readingAddService = readingAdd(logging);
            const deviceAddService = deviceAdd(logging);
            const timeRangeReadingAddService = timeRangeReadingAdd(logging);

            return deviceAddService(<DeviceAddRequest>{ deviceId: req.device.id, deviceName: req.device.name, deviceIp: req.device.ip })
                .then(deviceAddResponse => {
                    if (deviceAddResponse.error) {
                        return buildErrorResponse(deviceAddResponse.error);
                    }

                    if (!deviceAddResponse.payload || !deviceAddResponse.payload.device) {
                        return buildErrorResponse(Errors.ERROR_WHILE_ADD_DEVICE);
                    }

                    const readings = [
                        {
                            id: uuid.v4(),
                            type: ReadingTypes.TEMPERATURE,
                            value: req.airData.temperature
                        },
                        {
                            id: uuid.v4(),
                            type: ReadingTypes.TVOC,
                            value: req.airData.tvoc
                        },
                        {
                            id: uuid.v4(),
                            type: ReadingTypes.CO2,
                            value: req.airData.co2
                        },
                        {
                            id: uuid.v4(),
                            type: ReadingTypes.PRESSURE,
                            value: req.airData.pressure
                        },
                        {
                            id: uuid.v4(),
                            type: ReadingTypes.HUMIDITY,
                            value: req.airData.humidity
                        },
                    ].filter(m => !!m.value);

                    return Bluebird.map(readings, (reading => {
                        return readingAddService({
                            deviceId: req.device.id,
                            inserted: req.readingDate,
                            type: reading.type,
                            value: reading.value,
                            id: reading.id
                        })
                            .then(addReadingResponse => {
                                if (deviceAuthorizationResponse.error) {
                                    return buildErrorResponse(deviceAuthorizationResponse.error);
                                }

                                if (!addReadingResponse.payload) {
                                    return buildErrorResponse(Errors.ERROR_WHILE_ADD_READING);
                                }

                                const dateObj = new Date(req.readingDate);
                                const hours = StringUtils.padLeft(dateObj.getUTCHours(), '0', 2);
                                const day = StringUtils.padLeft(dateObj.getUTCDate(), '0', 2);
                                const month = StringUtils.padLeft(dateObj.getUTCMonth() + 1, '0', 2);
                                const year = "" + dateObj.getUTCFullYear();

                                return Promise
                                    .all([
                                        timeRangeReadingAddService({ deviceId: req.device.id, timeRange: year + month + day + hours, type: ReadingTypes.HUMIDITY, value: req.airData.humidity, granularity: Granularity.daily }),
                                        timeRangeReadingAddService({ deviceId: req.device.id, timeRange: year + month + day, type: ReadingTypes.HUMIDITY, value: req.airData.humidity, granularity: Granularity.monthly }),
                                        timeRangeReadingAddService({ deviceId: req.device.id, timeRange: year + month, type: ReadingTypes.HUMIDITY, value: req.airData.humidity, granularity: Granularity.yearly }),

                                        timeRangeReadingAddService({ deviceId: req.device.id, timeRange: year + month + day + hours, type: ReadingTypes.PRESSURE, value: req.airData.pressure, granularity: Granularity.daily }),
                                        timeRangeReadingAddService({ deviceId: req.device.id, timeRange: year + month + day, type: ReadingTypes.PRESSURE, value: req.airData.pressure, granularity: Granularity.monthly }),
                                        timeRangeReadingAddService({ deviceId: req.device.id, timeRange: year + month, type: ReadingTypes.PRESSURE, value: req.airData.pressure, granularity: Granularity.yearly }),

                                        timeRangeReadingAddService({ deviceId: req.device.id, timeRange: year + month + day + hours, type: ReadingTypes.CO2, value: req.airData.co2, granularity: Granularity.daily }),
                                        timeRangeReadingAddService({ deviceId: req.device.id, timeRange: year + month + day, type: ReadingTypes.CO2, value: req.airData.co2, granularity: Granularity.monthly }),
                                        timeRangeReadingAddService({ deviceId: req.device.id, timeRange: year + month, type: ReadingTypes.CO2, value: req.airData.co2, granularity: Granularity.yearly }),

                                        timeRangeReadingAddService({ deviceId: req.device.id, timeRange: year + month + day + hours, type: ReadingTypes.TVOC, value: req.airData.tvoc, granularity: Granularity.daily }),
                                        timeRangeReadingAddService({ deviceId: req.device.id, timeRange: year + month + day, type: ReadingTypes.TVOC, value: req.airData.tvoc, granularity: Granularity.monthly }),
                                        timeRangeReadingAddService({ deviceId: req.device.id, timeRange: year + month, type: ReadingTypes.TVOC, value: req.airData.tvoc, granularity: Granularity.yearly }),

                                        timeRangeReadingAddService({ deviceId: req.device.id, timeRange: year + month + day + hours, type: ReadingTypes.TEMPERATURE, value: req.airData.temperature, granularity: Granularity.daily }),
                                        timeRangeReadingAddService({ deviceId: req.device.id, timeRange: year + month + day, type: ReadingTypes.TEMPERATURE, value: req.airData.temperature, granularity: Granularity.monthly }),
                                        timeRangeReadingAddService({ deviceId: req.device.id, timeRange: year + month, type: ReadingTypes.TEMPERATURE, value: req.airData.temperature, granularity: Granularity.yearly }),
                                    ])
                                    .then(_ => {
                                        return buildResponse({});
                                    })
                            })
                            .catch(error => {
                                logging.error("deviceDataIngestion", `Error while adding reading: ${error}`);
                                return buildErrorResponse(Errors.ERROR_WHILE_ADD_READING);
                            });
                    }), { concurrency: 5 })
                        .then(_ => {
                            return buildResponse({});
                        });
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
    readingDate: number
}
