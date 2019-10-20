import { Errors } from "../entity/Errors";
import { ServiceResponse } from "../entity/ServiceResponse";
import { authorization } from "../service/Autorization";
import { ILogging } from "./Logging";

export const middlewareAuthorization = (logging: ILogging) => <T>(body: any, service: (body: any) => Promise<ServiceResponse<T>>): Promise<ServiceResponse<T>> => {
    logging.info("middlewareAuthorization", "Starts");

    return authorization(logging)({ accessToken: body.accessToken })
        .then((authorizationResponse): Promise<ServiceResponse<T>> => {
            if (authorizationResponse.error) {
                logging.error("middlewareAuthorization", `error 01 ${authorizationResponse.error}`);
                return Promise.resolve({ error: authorizationResponse.error });
            }

            if (authorizationResponse.payload === true) {
                return service(body);
            }

            logging.error("middlewareAuthorization", `error 02 ${Errors.AUTHORIZATION_ERROR}`);
            return Promise.resolve({ error: Errors.AUTHORIZATION_ERROR });
        })
        .catch((err: any) => {
            logging.error("middlewareAuthorization", `Error while authorizing: ${err}`);
            return Promise.resolve({ error: err });
        });
};