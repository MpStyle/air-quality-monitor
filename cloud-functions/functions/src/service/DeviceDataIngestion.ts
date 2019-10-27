import { ILogging } from "../book/Logging"
import { ServiceRequest } from "../entity/ServiceRequest"
import { ServiceResponse } from "../entity/ServiceResponse"
import { deviceAuthorization } from "./DeviceAuthorization"
import { Errors } from "../entity/Errors"
import { deviceAdd, DeviceAddRequest } from "./DeviceAdd"
import { measurementAdd } from "./MeasurementAdd"
import uuid = require("uuid")

export const deviceDataIngestion = (logging: ILogging) => (req: DeviceDataIngestionRequest): Promise<DeviceDataIngestionResponse> => {
    if (!req.secretKey || !req.device.id || !req.measurementDate || !req.airData.co2 || !req.airData.humidity || !req.airData.pressure || !req.airData.temperature || !req.airData.tvoc) {
        return Promise.resolve(<DeviceDataIngestionResponse>{ error: Errors.INVALID_DEVICE_DATA_INGESTION_REQUEST });
    }

    logging.info("deviceDataIngestion", "Starts");

    return deviceAuthorization(logging)({ secretKey: req.secretKey })
        .then(deviceAuthorizationResponse => {
            if (deviceAuthorizationResponse.error) {
                return <DeviceDataIngestionResponse>{ error: deviceAuthorizationResponse.error };
            }

            if (!deviceAuthorizationResponse.payload) {
                return <DeviceDataIngestionResponse>{ error: Errors.DEVICE_UNAUTHORIZED };
            }

            return deviceAdd(logging)(<DeviceAddRequest>{ deviceId: req.device.id, deviceName: req.device.name, deviceIp: req.device.ip })
                .then(deviceAddResponse => {
                    if (deviceAddResponse.error) {
                        return <DeviceDataIngestionResponse>{ error: deviceAddResponse.error };
                    }

                    if (!deviceAddResponse.payload) {
                        return <DeviceDataIngestionResponse>{ error: Errors.ERROR_WHILE_ADD_DEVICE };
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
                            ]
                        })
                        .then(addMeasurementResponse => {
                            if (addMeasurementResponse.error) {
                                return <DeviceDataIngestionResponse>{ error: deviceAuthorizationResponse.error };
                            }

                            if (!addMeasurementResponse.payload) {
                                return <DeviceDataIngestionResponse>{ error: Errors.ERROR_WHILE_ADD_MEASUREMENT };
                            }

                            return <DeviceDataIngestionResponse>{ payload: true };
                        })
                        .catch(error => {
                            return <DeviceDataIngestionResponse>{ error: `Error ${Errors.ERROR_WHILE_ADD_MEASUREMENT} - ${error}` };
                        });
                })
                .catch(error => {
                    return <DeviceDataIngestionResponse>{ error: `Error ${Errors.ERROR_WHILE_ADD_DEVICE} - ${error}` };
                });
        })
        .catch(error => {
            return <DeviceDataIngestionResponse>{ error: `Error ${Errors.DEVICE_AUTHORIZATION_ERROR} - ${error}` };
        });
}

export interface DeviceDataIngestionRequest extends ServiceRequest {
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

export interface DeviceDataIngestionResponse extends ServiceResponse<boolean> { }