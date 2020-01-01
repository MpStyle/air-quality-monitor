import { Action } from "redux";
import { UpdateTemperatureUnitAction, UpdateTemperatureUnitActionName } from "../action/UpdateTemperatureUnitAction";
import { TEMPERATURE_UNIT_KEY } from "../book/LocalStorageKeys";
import { MeterUnit } from "../entity/MeterUnit";
import { initialAppState } from "../store/InitialAppState";

export const meterUnitReducer = (state: MeterUnit = initialAppState.meterUnit, action: Action): MeterUnit => {
    switch (action.type) {
        case UpdateTemperatureUnitActionName:
            const updateTemperatureUnitActionName = action as UpdateTemperatureUnitAction;
            localStorage.setItem(TEMPERATURE_UNIT_KEY, updateTemperatureUnitActionName.temperatureUnit);
            return Object.assign({}, { ...state }, { temperature: updateTemperatureUnitActionName.temperatureUnit });
    }
    return state;
};