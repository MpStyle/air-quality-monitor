import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { fetchAirQualityDataSuccessActionBuilder, fetchAirQualityDataStartActionBuilder, fetchAirQualityDataErrorActionBuilder } from '../../action/FetchAirQualityDataAction';
import { fetchDevicesSuccessActionBuilder, fetchDevicesStartActionBuilder, fetchDevicesErrorActionBuilder } from '../../action/FetchDevicesAction';
import { updateCurrentDeviceActionBuilder } from '../../action/UpdateCurrentDeviceAction';
import { userDevicesList } from '../../book/UserDevicesList';
import { userLastReadings } from '../../book/UserLastReadings';
import { userRenewAccessToken, UserRenewAccessTokenResponse } from '../../book/UserRenewAccessToken';
import { AirQualityData } from '../../entity/AirQualityData';
import { AppState } from '../../entity/AppState';
import { Device } from '../../entity/Device';
import { LoginToken } from '../../entity/LoginToken';
import { ServiceResponse } from '../../entity/ServiceResponse';
import { Dashboard, DashboardProps } from './Dashboard';

export const DashboardContainer = connect(
    (appState: AppState): DashboardProps => {
        return {
            token: appState.token,
            airQualityData: appState.airQualityData,
            airStatus: appState.airStatus,
            meterUnit: appState.settings.meterUnit,
            currentDevice: appState.currentDevice,
            devicesData: appState.devicesData,
            suggestions: appState.suggestions,
            decimalSeparator: appState.settings.decimalSeparator,
            iconVisualizationType: appState.settings.iconVisualizationType
        } as DashboardProps;
    },
    (dispatch: Dispatch): DashboardProps => {
        return {
            onCurrentDeviceChange: (device: Device) => { dispatch(updateCurrentDeviceActionBuilder(device)); },
            fetchDevices: (token: LoginToken) => {
                dispatch(fetchDevicesStartActionBuilder());

                const renewToken: Promise<ServiceResponse<UserRenewAccessTokenResponse>> = token.expiredAt <= Date.now() ? userRenewAccessToken(token.refreshToken) : Promise.resolve({ payload: { accessToken: token.accessToken, expiredAt: token.expiredAt } });

                renewToken.then(response => {
                    if (response.error) {
                        console.log("Error renew token: ", response.error);
                        return;
                    }

                    if (!response.payload) {
                        console.log("Error renew token: ", "invalid payload");
                        return;
                    }

                    userDevicesList(response.payload.accessToken)
                        .then(response => {
                            if (response.error) {
                                console.log(response.error);
                                dispatch(fetchDevicesErrorActionBuilder(response.error));
                                return;
                            }

                            dispatch(fetchDevicesSuccessActionBuilder(response.payload?.devices || []));
                        })
                        .catch((error) => {
                            // TODO: dispatch an error message
                            console.error(`Error while fetch devices: ${error}`);

                            dispatch(fetchDevicesErrorActionBuilder(error));
                        });
                });
            },
            fetchAirQualityData: (token: LoginToken, currentDeviceId: string) => {
                const poller = () => {
                    dispatch(fetchAirQualityDataStartActionBuilder());

                    const renewToken: Promise<ServiceResponse<UserRenewAccessTokenResponse>> = token.expiredAt <= Date.now() ? userRenewAccessToken(token.refreshToken) : Promise.resolve({ payload: { accessToken: token.accessToken, expiredAt: token.expiredAt } });

                    renewToken.then(response => {
                        if (response.error) {
                            console.log("Error renew token: ", response.error);
                            return;
                        }

                        if (!response.payload) {
                            console.log("Error renew token: ", "invalid payload");
                            return;
                        }

                        userLastReadings(currentDeviceId, response.payload.accessToken)
                            .then(response => {
                                if (response.error) {
                                    console.log(response.error);
                                    dispatch(fetchAirQualityDataErrorActionBuilder(response.error));
                                    return;
                                }

                                dispatch(fetchAirQualityDataSuccessActionBuilder(response.payload as AirQualityData));

                                setTimeout(() => poller(), parseInt(process.env.REACT_APP_AIR_QUALITY_DATA_REFRESH_TIME as string));
                            })
                            .catch((error) => {
                                // TODO: dispatch an error message
                                console.error(`Error while fetch air quality data: ${error}`);
                                dispatch(fetchAirQualityDataErrorActionBuilder(error));
                            });
                    });
                };

                poller();
            }
        } as DashboardProps;
    }
)(Dashboard);