import { ILogging } from "../../book/Logging";
import { Device } from "../../entity/Device";
import { Errors } from "../../entity/Errors";
import { ReadingTypes } from '../../entity/ReadingTypes';
import { Scopes } from "../../entity/Scopes";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import { deviceById } from "../crud/DeviceById";
import { deviceUpsert } from "../crud/DeviceUpsert";
import { deviceAuthorization } from "./DeviceAuthorization";
import uuid = require("uuid")
import Bluebird = require("bluebird");
import { readingUpsert } from "../crud/ReadingUpsert";

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

            const readingUpsertService = readingUpsert(logging);
            const deviceUpsertService = deviceUpsert(logging);
            const deviceByIdService = deviceById(logging);

            return deviceByIdService({ deviceId: req.device.id })
                .then(response => {
                    if (response.error) {
                        return buildErrorResponse(response.error);
                    }

                    const device = !response.payload || !response.payload.device ? <Device>{
                        address: req.device.address,
                        deviceIP: req.device.ip,
                        deviceId: req.device.id,
                        name: req.device.name,
                        updated: Date.now(),
                        enabled: true,
                        inserted: Date.now(),
                        wifiName: req.device.wifiName,
                        wifiSignalStrength: req.device.wifiSignalStrength,
                    } : <Device>{
                        ...response.payload.device,
                        address: req.device.address,
                        deviceIP: req.device.ip,
                        deviceId: req.device.id,
                        name: req.device.name,
                        updated: Date.now(),
                        wifiName: req.device.wifiName,
                        wifiSignalStrength: req.device.wifiSignalStrength,
                    };

                    return deviceUpsertService({ device })
                        .then(deviceUpsertResponse => {
                            if (deviceUpsertResponse.error) {
                                return buildErrorResponse(deviceUpsertResponse.error);
                            }

                            if (!deviceUpsertResponse.payload || !deviceUpsertResponse.payload.device) {
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
                                }
                            ].filter(m => m.value !== null && m.value !== undefined);

                            return Bluebird.map(readings, (reading) => {
                                return readingUpsertService({
                                    reading: {
                                        deviceId: req.device.id,
                                        inserted: req.readingDate,
                                        type: reading.type,
                                        value: reading.value,
                                        readingId: uuid.v4(),
                                        updated: Date.now()
                                    }
                                });
                            }, { concurrency: 5 })
                                .then(readingAddResponses => {
                                    readingAddResponses.forEach(r => {
                                        if (r.error) {
                                            logging.error("deviceDataIngestion", "Error while adding reading: " + JSON.stringify(r.error));
                                        }
                                    });

                                    return buildResponse({});
                                });
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
        ip: string,
        address?: string,
        wifiName: string,
        wifiSignalStrength: number
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
