import { Action } from "redux";
import { FetchAirQualityDataSuccessAction, FetchAirQualityDataSuccessActionName } from '../action/FetchAirQualityDataSuccessAction';
import { AIR_QUALITY_DATA_CO2_KEY, AIR_QUALITY_DATA_HUMIDITY_KEY, AIR_QUALITY_DATA_INSERTED_KEY, AIR_QUALITY_DATA_PRESSURE_KEY, AIR_QUALITY_DATA_TEMPERATURE_KEY, AIR_QUALITY_DATA_TVOC_KEY } from '../book/LocalStorageKeys';
import { AirQualityData } from "../entity/AirQualityData";
import { initialAppState } from "../store/InitialAppState";

export const airQualityDataReducer = (state: AirQualityData = initialAppState.airQualityData, action: Action): AirQualityData => {
    switch (action.type) {
        case FetchAirQualityDataSuccessActionName:
            const updateAirQualityDataAction = action as FetchAirQualityDataSuccessAction;
            sessionStorage.setItem(AIR_QUALITY_DATA_CO2_KEY, updateAirQualityDataAction.data.co2.toString());
            sessionStorage.setItem(AIR_QUALITY_DATA_HUMIDITY_KEY, updateAirQualityDataAction.data.humidity.toString());
            sessionStorage.setItem(AIR_QUALITY_DATA_INSERTED_KEY, updateAirQualityDataAction.data.inserted.toString());
            sessionStorage.setItem(AIR_QUALITY_DATA_PRESSURE_KEY, updateAirQualityDataAction.data.pressure.toString());
            sessionStorage.setItem(AIR_QUALITY_DATA_TEMPERATURE_KEY, updateAirQualityDataAction.data.temperature.toString());
            sessionStorage.setItem(AIR_QUALITY_DATA_TVOC_KEY, updateAirQualityDataAction.data.tvoc.toString());
            return updateAirQualityDataAction.data;
    }
    return state;
};