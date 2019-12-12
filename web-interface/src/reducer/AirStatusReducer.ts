import { Action } from "redux";
import { FetchAirQualityDataSuccessAction, FetchAirQualityDataSuccessActionName } from '../action/FetchAirQualityDataSuccessAction';
import { AirQuality, AirStatus } from "../entity/AirStatus";
import { initialAppState } from "../store/InitialAppState";

export const airStatusReducer = (state: AirStatus = initialAppState.airStatus, action: Action): AirStatus => {
    switch (action.type) {
        case FetchAirQualityDataSuccessActionName:
            const updateAirQualityDataAction = action as FetchAirQualityDataSuccessAction;
            const airStatus: AirStatus = {
                co2: co2Quality(updateAirQualityDataAction.data.co2),
                humidity: humidityQuality(updateAirQualityDataAction.data.humidity),
                noise: noiseQuality(updateAirQualityDataAction.data.noise),
                pressure: AirQuality.Excellent,
                temperature: temperatureQuality(updateAirQualityDataAction.data.temperature),
                tvoc: tvocQuality(updateAirQualityDataAction.data.tvoc),
            };

            return airStatus;
    }
    return state;
};

const noiseQuality = (noise: number): AirQuality => {
    if (noise > 120) {
        return AirQuality.VeryBad;
    }

    if (noise > 100) {
        return AirQuality.NotGood;
    }

    if (noise > 70) {
        return AirQuality.Good;
    }

    return AirQuality.Excellent;
};

const humidityQuality = (humidity: number): AirQuality => {
    if (humidity <= 15) {
        return AirQuality.VeryBad;
    }

    if (humidity >= 85) {
        return AirQuality.VeryBad;
    }

    if (humidity <= 35) {
        return AirQuality.NotGood;
    }

    if (humidity >= 65) {
        return AirQuality.NotGood;
    }

    if (humidity < 45) {
        return AirQuality.Good;
    }

    if (humidity > 55) {
        return AirQuality.Good;
    }

    return AirQuality.Excellent;
};

const temperatureQuality = (temperature: number): AirQuality => {
    if (temperature > 35 || temperature < 0) {
        return AirQuality.VeryBad;
    }

    if (temperature > 30 || temperature < 10) {
        return AirQuality.NotGood;
    }

    if (temperature > 25 || temperature < 20) {
        return AirQuality.Good;
    }

    return AirQuality.Excellent;
};

const co2Quality = (co2: number): AirQuality => {
    if (co2 > 1600) {
        return AirQuality.VeryBad;
    }

    if (co2 > 1000) {
        return AirQuality.NotGood;
    }

    if (co2 > 700) {
        return AirQuality.Good;
    }

    return AirQuality.Excellent;
};

const tvocQuality = (tvoc: number): AirQuality => {
    if (tvoc > 0.5) {
        return AirQuality.VeryBad;
    }

    return AirQuality.Excellent;
};