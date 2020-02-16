import { ILogging } from "../../book/Logging";
import { Service } from "../../entity/Service";

export const healthCheck = (logging: ILogging): Service<{}, string> => () => {
    logging.info("healthCheck", "Starts");
    return Promise.resolve({ payload: 'ok' });
};