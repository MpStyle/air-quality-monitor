import { ILogging } from "../../book/Logging";
import { Service, buildResponse } from "../../entity/Service";
import { AirStatus } from "../../entity/AirStatus";
import { AirQuality } from "../../entity/AirQuality";
import { averageAirStatus } from "../../book/AverageAirStatus";
import { buildErrorResponse } from './../../entity/Service';
import { Errors } from "../../entity/Errors";

export const userSuggestions = (logging: ILogging): Service<UserSuggestionsRequest, UserSuggestionsResponse> => req => {
    if (!req.airStatus || !req.language) {
        return buildErrorResponse(Errors.INVALID_USER_SUGGESTIONS_REQUEST);
    }

    logging.info("userSuggestions", "Starts");

    const suggestions: string[] = [];

    if (req.airStatus.co2) {
        switch (req.airStatus.co2) {
            case AirQuality.NotGood:
                suggestions.push("It's time to open a window");
                break;
            case AirQuality.VeryBad:
                suggestions.push("Do you live in Pianura Padana?");
                break;
        }
    }

    if (req.airStatus.humidity) {
        switch (req.airStatus.humidity) {
            case AirQuality.NotGood:
                if (req.airStatus.humidity < 50) {
                    suggestions.push("Drink a glass of water");
                }
                else {
                    suggestions.push("Are you in the rain forest?");
                }
                break;
            case AirQuality.VeryBad:
                if (req.airStatus.humidity < 50) {
                    suggestions.push("I don't know, where are you now?");
                }
                else {
                    suggestions.push("I'm singin' in the rain... Just singin' in the rain...");
                }
                break;
        }
    }

    if (req.airStatus.temperature) {
        switch (req.airStatus.temperature) {
            case AirQuality.NotGood:
                break;
            case AirQuality.VeryBad:
                break;
        }
    }

    if (req.airStatus.tvoc) {
        switch (req.airStatus.tvoc) {
            case AirQuality.VeryBad:
                suggestions.push("Do you switch off the cooker?");
                break;
        }
    }

    if (averageAirStatus(req.airStatus) === AirQuality.Excellent) {
        suggestions.push("Really?! Where is the paradise you're living?");
    }

    return buildResponse<UserSuggestionsResponse>({ suggestions });
};

export interface UserSuggestionsRequest {
    airStatus: AirStatus;
    language: string;
}

export interface UserSuggestionsResponse {
    suggestions: string[];
}