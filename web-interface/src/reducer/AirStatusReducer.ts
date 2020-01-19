import { Action } from "redux";
import { FetchAirQualityDataSuccessAction, FetchAirQualityDataSuccessActionName } from '../action/FetchAirQualityDataAction';
import { co2Quality, humidityQuality, temperatureQuality, tvocQuality } from "../book/AirQuality";
import { AirQuality, AirStatus } from "../entity/AirStatus";
import { initialAppState } from "../store/InitialAppState";

export const airStatusReducer = (state: AirStatus = initialAppState.airStatus, action: Action): AirStatus => {
    switch (action.type) {
        case FetchAirQualityDataSuccessActionName:
            const updateAirQualityDataAction = action as FetchAirQualityDataSuccessAction;
            const airStatus: AirStatus = {
                co2: co2Quality(updateAirQualityDataAction.data.co2),
                humidity: humidityQuality(updateAirQualityDataAction.data.humidity),
                pressure: AirQuality.Excellent,
                temperature: temperatureQuality(updateAirQualityDataAction.data.temperature),
                tvoc: tvocQuality(updateAirQualityDataAction.data.tvoc),
            };

            return airStatus;
    }
    return state;
};