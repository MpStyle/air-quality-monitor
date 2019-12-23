import { connect } from "react-redux";
import { Dispatch } from "redux";
import { updateDecimalSeparatorActionBuilder } from "../action/UpdateDecimalSeparatorAction";
import { updateTemperatureUnitActionBuilder } from "../action/UpdateTemperatureUnitAction";
import { AppState } from "../entity/AppState";
import { AppSettings, AppSettingsProps } from "./AppSettings";

export const AppSettingsContainer = connect(
    (appState: AppState) => {
        return {
            temperatureUnit: appState.meterUnit.temperature,
            decimalSeparator: appState.decimalSeparator
        } as AppSettingsProps;
    },
    (dispatch: Dispatch) => {
        return {
            onTemperatureUnitChange: (temperatureUnit) => {
                dispatch(updateTemperatureUnitActionBuilder(temperatureUnit));
            },
            onDecimalSeparatorChange: (decimalSeparator) => {
                dispatch(updateDecimalSeparatorActionBuilder(decimalSeparator));
            }
        } as AppSettingsProps;
    }
)(AppSettings);