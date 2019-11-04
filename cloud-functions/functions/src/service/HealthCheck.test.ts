import { healthCheck } from "./HealthCheck";
import { Logging } from './../book/Logging';

test('HealthCheck', () => {
    expect(healthCheck(new Logging())().payload).toEqual('ok');
});