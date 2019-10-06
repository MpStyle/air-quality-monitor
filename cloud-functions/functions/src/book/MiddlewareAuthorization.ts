import { Errors } from "../entity/Errors";
import { ServiceResponse } from "../entity/ServiceResponse";
import { authorization } from "../service/Autorization";

export const middlewareAuthorization = <T>(body: any, service: (body: any) => Promise<ServiceResponse<T>>): Promise<ServiceResponse<T>> => {
    console.log('middlewareAuthorization starts...');
    return authorization({ accessToken: body.accessToken })
        .then((authorizationResponse): Promise<ServiceResponse<T>> => {
            if (authorizationResponse.error) {
                console.log(`middlewareAuthorization error: ${authorizationResponse.error}`);
                return Promise.resolve({ error: authorizationResponse.error });
            }

            if (authorizationResponse) {
                return service(body);
            }

            console.log(`middlewareAuthorization error: ${Errors.AUTHORIZATION_ERROR}`);
            return Promise.resolve({ error: Errors.AUTHORIZATION_ERROR });
        });
};