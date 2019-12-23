import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { fetchAirQualityDataSuccessActionBuilder } from '../action/FetchAirQualityDataSuccessAction';
import { fetchDevicesSuccessActionBuilder } from '../action/FetchDevicesSuccessAction';
import { updateCurrentDeviceIdActionBuilder } from '../action/UpdateCurrentDeviceIdAction';
import { fetchAirQualityData } from '../book/FetchAirQualityData';
import { fetchDevices } from '../book/FetchDevices';
import { AirQualityData } from '../entity/AirQualityData';
import { AppState } from '../entity/AppState';
import { Dashboard, DashboardProps } from './Dashboard';

export const DashboardContainer = connect(
    (appState: AppState): DashboardProps => {
        return {
            airQualityData: appState.airQualityData,
            airStatus: appState.airStatus,
            meterUnit: appState.meterUnit,
            currentDeviceId: appState.currentDevice,
            devices: appState.devices,
            suggestions: appState.suggestions,
            secretKey: appState.secretKey,
            decimalSeparator: appState.decimalSeparator
        } as DashboardProps;
    },
    (dispatch: Dispatch): DashboardProps => {
        return {
            onCurrentDeviceIdChange: (deviceId: string) => { dispatch(updateCurrentDeviceIdActionBuilder(deviceId)); },
            fetchDevices: (secretKey: string) => {
                fetchDevices(secretKey)
                    .then(response => {
                        if (response.error) {
                            console.log(response.error);
                            return;
                        }

                        dispatch(fetchDevicesSuccessActionBuilder(response.payload?.devices || []));
                    })
                    .catch((error) => {
                        // TODO: dispatch an error message
                        console.error(`Error while fetch devices: ${error}`);
                    });
            },
            fetchAirQualityData: (currentDeviceId: string, secretKey: string) => {
                const poller = () => {
                    fetchAirQualityData(currentDeviceId, secretKey)
                        .then(response => {
                            if (response.error) {
                                console.log(response.error);
                                return;
                            }

                            dispatch(fetchAirQualityDataSuccessActionBuilder(response.payload as AirQualityData));

                            setTimeout(() => poller(), parseInt(process.env.REACT_APP_AIR_QUALITY_DATA_REFRESH_TIME as string));
                        })
                        .catch((error) => {
                            // TODO: dispatch an error message
                            console.error(`Error while fetch air quality data: ${error}`);
                        });
                };

                poller();
            }
        } as DashboardProps;
    }
)(Dashboard);