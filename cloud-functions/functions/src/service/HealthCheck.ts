import { ILogging } from "../book/Logging";
import { Service } from "../entity/Service";

export const healthCheck = (_logging: ILogging): Service<{}, string> => (_) => (Promise.resolve({ payload: 'ok' }));