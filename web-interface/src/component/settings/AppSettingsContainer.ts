import { connect } from "react-redux";
import { Dispatch } from "redux";
import { updateDecimalSeparatorActionBuilder } from "../../action/UpdateDecimalSeparatorAction";
import { updateIconVisualizationTypeActionBuilder } from "../../action/UpdateIconVisualizationTypeAction";
import { updateShortDateFormatActionBuilder } from "../../action/UpdateShortDateFormatAction";
import { updateTemperatureUnitActionBuilder } from "../../action/UpdateTemperatureUnitAction";
import { AppState } from "../../entity/AppState";
import { updateDateFormatActionBuilder } from './../../action/UpdateDateFormatAction';
import { AppSettings, AppSettingsProps } from "./AppSettings";

export const AppSettingsContainer = connect(
    (appState: AppState) => {
        return {
            temperatureUnit: appState.settings.meterUnit.temperature,
            decimalSeparator: appState.settings.decimalSeparator,
            iconVisualizationType: appState.settings.iconVisualizationType,
            dateFormat: appState.settings.dateFormat,
            shortDateFormat: appState.settings.shortDateFormat,
        } as AppSettingsProps;
    },
    (dispatch: Dispatch) => {
        return {
            onTemperatureUnitChange: (temperatureUnit) => {
                dispatch(updateTemperatureUnitActionBuilder(temperatureUnit));
            },
            onDecimalSeparatorChange: (decimalSeparator) => {
                dispatch(updateDecimalSeparatorActionBuilder(decimalSeparator));
            },
            onIconVisualizationTypeChange: (value) => {
                dispatch(updateIconVisualizationTypeActionBuilder(value));
            },
            onDateFormatChange: (value) => {
                dispatch(updateDateFormatActionBuilder(value));
            },
            onShortDateFormatChange: (value) => {
                dispatch(updateShortDateFormatActionBuilder(value));
            }
        } as AppSettingsProps;
    }
)(AppSettings);