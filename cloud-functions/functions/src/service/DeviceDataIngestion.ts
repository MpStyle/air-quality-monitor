import { ILogging } from "../book/Logging";
import { Errors } from "../entity/Errors";
import { buildErrorResponse, Service, buildResponse } from "../entity/Service";
import { authorization } from "./Authorization";
import { deviceAdd, DeviceAddRequest } from "./DeviceAdd";
import { measurementAdd } from "./MeasurementAdd";
import uuid = require("uuid")

export const deviceDataIngestion = (logging: ILogging): Service<DeviceDataIngestionRequest, {}> => req => {
    if (!req.secretKey || !req.device.id || !req.measurementDate) {
        return buildErrorResponse(Errors.INVALID_DEVICE_DATA_INGESTION_REQUEST);
    }

    logging.info("deviceDataIngestion", "Starts");

    return authorization(logging)({ secretKey: req.secretKey })
        .then(deviceAuthorizationResponse => {
            if (deviceAuthorizationResponse.error) {
                return buildErrorResponse(deviceAuthorizationResponse.error);
            }

            if (!deviceAuthorizationResponse.payload) {
                return buildErrorResponse(Errors.DEVICE_UNAUTHORIZED);
            }

            return deviceAdd(logging)(<DeviceAddRequest>{ deviceId: req.device.id, deviceName: req.device.name, deviceIp: req.device.ip })
                .then(deviceAddResponse => {
                    if (deviceAddResponse.error) {
                        return buildErrorResponse(deviceAddResponse.error);
                    }

                    if (!deviceAddResponse.payload || !deviceAddResponse.payload.device) {
                        return buildErrorResponse(Errors.ERROR_WHILE_ADD_DEVICE);
                    }

                    return measurementAdd(logging)
                        ({
                            deviceId: req.device.id, inserted: req.measurementDate, measurements: [
                                {
                                    id: uuid.v4(),
                                    type: 'temperature',
                                    value: req.airData.temperature
                                },
                                {
                                    id: uuid.v4(),
                                    type: 'tvoc',
                                    value: req.airData.tvoc
                                },
                                {
                                    id: uuid.v4(),
                                    type: 'co2',
                                    value: req.airData.co2
                                },
                                {
                                    id: uuid.v4(),
                                    type: 'pressure',
                                    value: req.airData.pressure
                                },
                                {
                                    id: uuid.v4(),
                                    type: 'humidity',
                                    value: req.airData.humidity
                                },
                            ].filter(m => !!m.value)
                        })
                        .then(addMeasurementResponse => {
                            if (addMeasurementResponse.error) {
                                return buildErrorResponse(deviceAuthorizationResponse.error);
                            }

                            if (!addMeasurementResponse.payload) {
                                return buildErrorResponse(Errors.ERROR_WHILE_ADD_MEASUREMENT);
                            }

                            return buildResponse({});
                        })
                        .catch(error => {
                            return buildErrorResponse(`Error ${Errors.ERROR_WHILE_ADD_MEASUREMENT} - ${error}`);
                        });
                })
                .catch(error => {
                    return buildErrorResponse(`Error ${Errors.ERROR_WHILE_ADD_DEVICE} - ${error}`);
                });
        })
        .catch(error => {
            return buildErrorResponse(`Error ${Errors.DEVICE_AUTHORIZATION_ERROR} - ${error}`);
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
