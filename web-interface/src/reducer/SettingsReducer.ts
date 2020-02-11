
import { Action } from "redux";
import { UpdateDecimalSeparatorAction, UpdateDecimalSeparatorActionName } from "../action/UpdateDecimalSeparatorAction";
import { UpdateIconVisualizationTypeAction, UpdateIconVisualizationTypeActionName } from "../action/UpdateIconVisualizationTypeAction";
import { UpdateTemperatureUnitAction, UpdateTemperatureUnitActionName } from "../action/UpdateTemperatureUnitAction";
import { AIR_QUALITY_DATA_DECIMAL_SEPARATOR_KEY, AIR_QUALITY_DATA_ICON_LABEL_VISUALIZATION_TYPE_KEY, TEMPERATURE_UNIT_KEY } from "../book/LocalStorageKeys";
import { localStorageManager } from "../book/LocalStorageManager";
import { Settings } from "../entity/Settings";
import { initialAppState } from "../store/InitialAppState";

export const settingsReducer = (state: Settings = initialAppState.settings, action: Action): Settings => {
    switch (action.type) {
        case UpdateIconVisualizationTypeActionName:
            const visualizationType = (action as UpdateIconVisualizationTypeAction).visualizationType;

            localStorageManager.setItem(AIR_QUALITY_DATA_ICON_LABEL_VISUALIZATION_TYPE_KEY, visualizationType);

            return { ...state, iconVisualizationType: visualizationType } as Settings;

        case UpdateTemperatureUnitActionName:
            const temperatureUnit = (action as UpdateTemperatureUnitAction).temperatureUnit;

            localStorageManager.setItem(TEMPERATURE_UNIT_KEY, temperatureUnit);

            return { ...state, meterUnit: { ...state.meterUnit, temperature: temperatureUnit } } as Settings;

        case UpdateDecimalSeparatorActionName:
            const separator = (action as UpdateDecimalSeparatorAction).separator;

            localStorageManager.setItem(AIR_QUALITY_DATA_DECIMAL_SEPARATOR_KEY, separator);

            return { ...state, decimalSeparator: separator } as Settings;
    }
    return state;
};