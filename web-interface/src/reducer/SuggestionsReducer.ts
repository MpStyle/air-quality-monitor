import { Action } from "redux";
import { FetchAirQualityDataSuccessActionName } from "../action/FetchAirQualityDataAction";
import { FetchDevicesSuccessAction, FetchDevicesSuccessActionName } from "../action/FetchDevicesAction";
import { averageAirStatus } from "../book/AverageAirStatus";
import { AirQuality, AirStatus } from "../entity/AirStatus";
import { initialAppState } from "../store/InitialAppState";
import { airStatusReducer } from './AirStatusReducer';

export const suggestionsReducer = (state: string[] = initialAppState.suggestions, action: Action): string[] => {
    switch (action.type) {
        case FetchDevicesSuccessActionName:
            const updateDevicesAction = action as FetchDevicesSuccessAction;
            if (!updateDevicesAction.devices || !updateDevicesAction.devices.length) {
                return [];
            }
            break;
        case FetchAirQualityDataSuccessActionName:
            const airStatus: AirStatus = airStatusReducer(initialAppState.airStatus, action);
            const suggestions: string[] = [];

            switch (airStatus.co2) {
                case AirQuality.NotGood:
                    suggestions.push("It's time to open a window");
                    break;
                case AirQuality.VeryBad:
                    suggestions.push("Do you live in Pianura Padana?");
                    break;
            }

            switch (airStatus.humidity) {
                case AirQuality.NotGood:
                    if (airStatus.humidity < 50) {
                        suggestions.push("Drink a glass of water");
                    }
                    else {
                        suggestions.push("Are you in the rain forest?");
                    }
                    break;
                case AirQuality.VeryBad:
                    if (airStatus.humidity < 50) {
                        suggestions.push("I don't know, where are you now?");
                    }
                    else {
                        suggestions.push("I'm singin' in the rain... Just singin' in the rain...");
                    }
                    break;
            }

            switch (airStatus.temperature) {
                case AirQuality.NotGood:
                    break;
                case AirQuality.VeryBad:
                    break;
            }

            switch (airStatus.tvoc) {
                case AirQuality.VeryBad:
                    suggestions.push("Do you switch off the cooker?");
                    break;
            }

            if (averageAirStatus(airStatus) === AirQuality.Excellent) {
                suggestions.push("Really?! Where is the paradise you're living?");
            }

            return suggestions;
    }

    return state;
};