
import { Action } from "redux";
import { UpdateDecimalSeparatorAction, UpdateDecimalSeparatorActionName } from "../action/UpdateDecimalSeparatorAction";
import { UpdateIconVisualizationTypeAction, UpdateIconVisualizationTypeActionName } from "../action/UpdateIconVisualizationTypeAction";
import { UpdateShortDateFormatAction, UpdateShortDateFormatActionName } from "../action/UpdateShortDateFormatAction";
import { UpdateTemperatureUnitAction, UpdateTemperatureUnitActionName } from "../action/UpdateTemperatureUnitAction";
import { LocalStorageKey } from "../book/LocalStorageKey";
import { localStorageManager } from "../book/LocalStorageManager";
import { Settings } from "../entity/Settings";
import { initialAppState } from "../store/InitialAppState";
import { UpdateDateFormatAction, UpdateDateFormatActionName } from './../action/UpdateDateFormatAction';
import { UpdateLanguageAction, UpdateLanguageActionName } from './../action/UpdateLanguageAction';

export const settingsReducer = (state: Settings = initialAppState.settings, action: Action): Settings => {
    switch (action.type) {
        case UpdateLanguageActionName:
            const language = (action as UpdateLanguageAction).language;

            localStorageManager.setItem(LocalStorageKey.LANGUAGE_KEY, language);

            return { ...state, language } as Settings;

        case UpdateIconVisualizationTypeActionName:
            const visualizationType = (action as UpdateIconVisualizationTypeAction).visualizationType;

            localStorageManager.setItem(LocalStorageKey.ICON_LABEL_VISUALIZATION_TYPE_KEY, visualizationType);

            return { ...state, iconVisualizationType: visualizationType } as Settings;

        case UpdateTemperatureUnitActionName:
            const temperatureUnit = (action as UpdateTemperatureUnitAction).temperatureUnit;

            localStorageManager.setItem(LocalStorageKey.TEMPERATURE_UNIT_KEY, temperatureUnit);

            return { ...state, meterUnit: { ...state.meterUnit, temperature: temperatureUnit } } as Settings;

        case UpdateDecimalSeparatorActionName:
            const separator = (action as UpdateDecimalSeparatorAction).separator;

            localStorageManager.setItem(LocalStorageKey.DECIMAL_SEPARATOR_KEY, separator);

            return { ...state, decimalSeparator: separator } as Settings;

        case UpdateDateFormatActionName:
            const dateFormat = (action as UpdateDateFormatAction).dateFormat;
            localStorageManager.setItem(LocalStorageKey.DATE_FORMAT_KEY, dateFormat);

            return { ...state, dateFormat: dateFormat } as Settings;

        case UpdateShortDateFormatActionName:
            const shortDateFormat = (action as UpdateShortDateFormatAction).shortDateFormat;
            localStorageManager.setItem(LocalStorageKey.SHORT_DATE_FORMAT_KEY, shortDateFormat);

            return { ...state, shortDateFormat: shortDateFormat } as Settings;
    }
    return state;
};