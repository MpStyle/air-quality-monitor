import { AirStatus } from "../entity/AirStatus";
import { ServiceResponse } from "../entity/ServiceResponse";

export const userSuggestions = (airStatus: AirStatus): Promise<ServiceResponse<UserSuggestionsResponse>> => {
    const url = process.env.REACT_APP_AIR_QUALITY_DATA_REMOTE_URL as string;
    return fetch(`${url}/app/user-suggestions`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ airStatus, language: 'en' } as UserSuggestionsRequest)
    }).then((response): Promise<ServiceResponse<UserSuggestionsResponse>> => {
        return response.json();
    });
};

export interface UserSuggestionsRequest {
    airStatus: AirStatus;
    language: string;
}

export interface UserSuggestionsResponse {
    suggestions: string[];
}