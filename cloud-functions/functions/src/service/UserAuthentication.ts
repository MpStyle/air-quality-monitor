import { ILogging } from "../book/Logging";
import { ServiceRequest } from "../entity/ServiceRequest";
import { ServiceResponse } from "../entity/ServiceResponse";
const { OAuth2Client } = require('google-auth-library');
import functions = require('firebase-functions');
import { Errors } from "../entity/Errors";

export const userAuthentication = (logging: ILogging) => (req: UserAuthenticationRequest): Promise<UserAuthenticationResponse> => {
    if (!req.token || req.token === '') {
        return Promise.resolve(<UserAuthenticationResponse>{ error: Errors.INVALID_USER_AUTHENTICATION_REQUEST });
    }

    logging.info("userAuthentication", "Starts");

    const clientId = functions.config().airqualitymonitor.clientId;
    const emails: string = functions.config().airqualitymonitor.usersEmails;
    const client = new OAuth2Client(clientId);

    return client.verifyIdToken(
        {
            idToken: req.token,
            audience: clientId,
        })
        .then((ticket: any) => {
            const payload = ticket.getPayload();
            const email: string = payload['email'];

            return <UserAuthenticationResponse>{
                payload: emails.split(";").indexOf(email) !== -1
            };
        })
        .catch((error: any) => {
            return <UserAuthenticationResponse>{ error: error };
        });
}

export interface UserAuthenticationRequest extends ServiceRequest {
    token: string;
}

export interface UserAuthenticationResponse extends ServiceResponse<boolean> { }