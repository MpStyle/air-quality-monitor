import { ILogging } from "../book/Logging";
import { Service, buildErrorResponse, buildResponse } from "../entity/Service";
import { loginTokenDelete } from "../service/crud/LoginTokenDelete";
import { loginTokensSearch } from "../service/crud/LoginTokensSearch";
import Bluebird = require("bluebird");
import { Errors } from "../entity/Errors";

export const deleteOldLoginTokens = (logging: ILogging): Service<DeleteOldLoginTokensRequest, {}> => req => {
    logging.info("deleteOldLoginTokens", "Starts");

    const expiredBefore = req.lastExpiredAt - (24 * 60 * 60 * 1000); // 1 day

    logging.info("deleteOldLoginTokens", `expiredBefore: ${expiredBefore}`);

    return loginTokensSearch(logging)({ expiredBefore: expiredBefore })
        .then(response => {
            if (response.error) {
                logging.error("deleteOldLoginTokens", `loginTokenSearch - ${response.error}`);
                return buildErrorResponse(response.error);
            }

            if (!response.payload || !response.payload.loginTokens) {
                logging.error("deleteOldLoginTokens", `loginTokenSearch`);
                return buildErrorResponse(Errors.ERROR_WHILE_SEARCH_LOGIN_TOKEN);
            }

            return Bluebird.map(response.payload.loginTokens, (loginToken) => {
                logging.info("deleteOldLoginTokens", `Removing refresh token ${loginToken.refreshToken}...`);
                return loginTokenDelete(logging)({ refreshToken: loginToken.refreshToken });
            }, { concurrency: 5 })
                .then(_ => buildResponse({}));
        })
        .catch(err => {
            logging.error("deleteOldLoginTokens", `Error while deleting old login tokens: ${err}`);
            return buildErrorResponse(err);
        });
};

interface DeleteOldLoginTokensRequest {
    lastExpiredAt: number;
}