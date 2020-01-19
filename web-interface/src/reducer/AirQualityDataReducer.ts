import { Action } from "redux";
import { FetchAirQualityDataErrorActionName, FetchAirQualityDataStartActionName, FetchAirQualityDataSuccessAction, FetchAirQualityDataSuccessActionName } from '../action/FetchAirQualityDataAction';
import { AIR_QUALITY_DATA_CO2_KEY, AIR_QUALITY_DATA_HUMIDITY_KEY, AIR_QUALITY_DATA_INSERTED_KEY, AIR_QUALITY_DATA_PRESSURE_KEY, AIR_QUALITY_DATA_TEMPERATURE_KEY, AIR_QUALITY_DATA_TVOC_KEY } from '../book/LocalStorageKeys';
import { AirQualityData } from "../entity/AirQualityData";
import { LoadingState } from "../entity/LoadingState";
import { initialAppState } from "../store/InitialAppState";

export const airQualityDataReducer = (state: AirQualityData = initialAppState.airQualityData, action: Action): AirQualityData => {
    switch (action.type) {
        case FetchAirQualityDataSuccessActionName:
            const updateAirQualityDataAction = action as FetchAirQualityDataSuccessAction;
            localStorage.setItem(AIR_QUALITY_DATA_CO2_KEY, updateAirQualityDataAction.data.co2.toString());
            localStorage.setItem(AIR_QUALITY_DATA_HUMIDITY_KEY, updateAirQualityDataAction.data.humidity.toString());
            localStorage.setItem(AIR_QUALITY_DATA_INSERTED_KEY, updateAirQualityDataAction.data.inserted.toString());
            localStorage.setItem(AIR_QUALITY_DATA_PRESSURE_KEY, updateAirQualityDataAction.data.pressure.toString());
            localStorage.setItem(AIR_QUALITY_DATA_TEMPERATURE_KEY, updateAirQualityDataAction.data.temperature.toString());
            localStorage.setItem(AIR_QUALITY_DATA_TVOC_KEY, updateAirQualityDataAction.data.tvoc.toString());
            return { ...updateAirQualityDataAction.data, loadingState: LoadingState.success };
        case FetchAirQualityDataStartActionName: return { ...state, loadingState: LoadingState.loading };
        case FetchAirQualityDataErrorActionName: return { ...state, loadingState: LoadingState.error };
    }
    return state;
};