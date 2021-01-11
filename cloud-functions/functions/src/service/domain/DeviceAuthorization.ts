import { ILogging } from "../../book/Logging";
import { Authorization } from "../../entity/Authorization";
import { Errors } from "../../entity/Errors";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import { devicesSearch } from "../crud/DevicesSearch";

export const deviceAuthorization = (logging: ILogging): Service<DeviceAuthorizationRequest, DeviceAuthorizationResponse> => req => {
    try {
        logging.info("authorization", "Starts");

        return devicesSearch(logging)({
            secretKey: req.secretKey
        })
            .then(deviceAuthorizationResponse => {
                if (deviceAuthorizationResponse.error) {
                    return buildErrorResponse(deviceAuthorizationResponse.error);
                }

                if (!deviceAuthorizationResponse.payload || !deviceAuthorizationResponse.payload.devices || !deviceAuthorizationResponse.payload.devices.length) {
                    return buildErrorResponse(Errors.SECRET_KEY_NOT_FOUND);
                }

                return buildResponse(deviceAuthorizationResponse.payload.devices.map(d => {
                    return {
                        deviceId: d.deviceId,
                        scopes: d.scope.split(";")
                    } as Authorization;
                }));
            });
    }
    catch (error) {
        logging.error("deviceAuthorization", `Error while autorizating: ${error}`);
        return buildErrorResponse(error);
    }
};

export interface DeviceAuthorizationRequest {
    secretKey: string;
}

export interface DeviceAuthorizationResponse {
    authorizations: Authorization[]
};