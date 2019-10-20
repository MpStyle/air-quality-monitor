import { ILogging } from "../book/Logging";
import { ServiceResponse } from "../entity/ServiceResponse";

export const healthCheck = (_logging: ILogging) => () => <ServiceResponse<string>>{ payload: 'ok' };