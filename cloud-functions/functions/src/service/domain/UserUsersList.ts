import { ILogging } from "../../book/Logging";
import { Errors } from "../../entity/Errors";
import { usersSearch, UsersSearchRequest, UsersSearchResponse as UsersSearchResponse } from '../crud/UsersSearch';
import { userAuthorization } from "./UserAuthorization";
import { Service, buildErrorResponse, buildResponse } from "../../entity/Service";
import { Scopes } from "../../entity/Scopes";

export const userUsersList = (logging: ILogging): Service<UserUsersListRequest, UserUsersListResponse> => req => {
    if (!req.accessToken || req.accessToken === '') {
        return buildErrorResponse(Errors.INVALID_USER_USER_SEARCH_REQUEST);
    }

    logging.info("userUsersList", "Starts");

    return userAuthorization(logging)({ accessToken: req.accessToken })
        .then(authorizationResponse => {
            if (authorizationResponse.error) {
                return buildErrorResponse(authorizationResponse.error);
            }

            if (!authorizationResponse.payload) {
                return buildErrorResponse(Errors.USER_UNAUTHORIZED);
            }

            const userIds = authorizationResponse.payload.authorizations
                .filter(a => a.scopes.indexOf(Scopes.device_air_quality_data_read) !== -1)
                .map(a => a.deviceId);

            return usersSearch(logging)(req)
                .then(response => {
                    if (response.error) {
                        return buildErrorResponse(response.error);
                    }

                    if (!response.payload) {
                        return buildErrorResponse(Errors.USER_NOT_FOUND);
                    }

                    return buildResponse<UserUsersListResponse>({
                        users: response.payload.users.filter(d => userIds.indexOf(d.username) !== -1)
                    });
                });
        })
        .catch((error: any) => {
            logging.error("userUsersList", `Error while searching users: ${JSON.stringify(error)}`);
            return buildErrorResponse(Errors.ERROR_WHILE_LIST_USER);
        });
};

export interface UserUsersListRequest extends UsersSearchRequest {
    accessToken: string,
}

export interface UserUsersListResponse extends UsersSearchResponse {
}