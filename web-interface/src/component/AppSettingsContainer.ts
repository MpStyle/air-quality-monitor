import { connect } from "react-redux";
import { Dispatch } from "redux";
import { updateDecimalSeparatorActionBuilder } from "../action/UpdateDecimalSeparatorAction";
import { updateIconVisualizationTypeActionBuilder } from "../action/UpdateIconVisualizationTypeAction";
import { updateTemperatureUnitActionBuilder } from "../action/UpdateTemperatureUnitAction";
import { AppState } from "../entity/AppState";
import { AppSettings, AppSettingsProps } from "./AppSettings";

export const AppSettingsContainer = connect(
    (appState: AppState) => {
        return {
            temperatureUnit: appState.settings.meterUnit.temperature,
            decimalSeparator: appState.settings.decimalSeparator,
            iconVisualizationType: appState.settings.iconVisualizationType
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
            }
        } as AppSettingsProps;
    }
)(AppSettings);