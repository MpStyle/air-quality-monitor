import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { AppState } from '../../entity/AppState';
import { updateCurrentDeviceIdActionBuilder } from './../../action/UpdateCurrentDeviceIdAction';
import Home, { HomeProps } from "./Home";

export const HomeContainer = connect(
    (appState: AppState): HomeProps => {
        return {
            airQualityData: appState.airQualityData,
            airStatus: appState.airStatus,
            meterUnit: appState.meterUnit,
            currentDeviceId: appState.currentDevice,
            devices: appState.devices,
            suggestions: appState.suggestions
        } as HomeProps;
    },
    (dispatch: Dispatch): HomeProps => {
        return {
            onCurrentDeviceIdChange: (deviceId: string) => { dispatch(updateCurrentDeviceIdActionBuilder(deviceId)); }
        } as HomeProps;
    }
)(Home);