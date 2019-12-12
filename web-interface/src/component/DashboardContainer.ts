import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { fetchAirQualityDataSuccessActionBuilder } from '../action/FetchAirQualityDataSuccessAction';
import { fetchDevicesSuccessActionBuilder } from '../action/FetchDevicesSuccessAction';
import { updateCurrentDeviceIdActionBuilder } from '../action/UpdateCurrentDeviceIdAction';
import { fetchAirQualityData } from '../book/FetchAirQualityData';
import { fetchDevices } from '../book/FetchDevices';
import { AirQualityData } from '../entity/AirQualityData';
import { AppState } from '../entity/AppState';
import { Device } from '../entity/Device';
import { Dashboard, HomeProps } from './Dashboard';

export const DashboardContainer = connect(
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
            onCurrentDeviceIdChange: (deviceId: string) => { dispatch(updateCurrentDeviceIdActionBuilder(deviceId)); },
            fetchDevices: () => {
                fetchDevices()
                    .then((response: Device[]) => {
                        dispatch(fetchDevicesSuccessActionBuilder(response));
                    })
                    .catch((error) => {
                        // TODO: dispatch an error message
                        console.error(`Error while fetch devices: ${error}`);
                    });
            },
            fetchAirQualityData: (currentDeviceId: string) => {
                const poller = () => {
                    fetchAirQualityData(currentDeviceId)
                        .then((response: AirQualityData[]) => {
                            dispatch(fetchAirQualityDataSuccessActionBuilder(response[0]));
                        })
                        .catch((error) => {
                            // TODO: dispatch an error message
                            console.error(`Error while fetch air quality data: ${error}`);
                        });
                };

                setTimeout(() => poller(), parseInt(process.env.REACT_APP_AIR_QUALITY_DATA_REFRESH_TIME as string));
            }
        } as HomeProps;
    }
)(Dashboard);