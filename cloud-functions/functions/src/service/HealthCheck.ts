import { ServiceResponse } from "../entity/ServiceResponse";

export const healthCheck = () => <ServiceResponse<string>>{ payload: 'ok' };