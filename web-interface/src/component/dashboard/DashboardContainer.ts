import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { fetchDevicesErrorActionBuilder, fetchDevicesStartActionBuilder, fetchDevicesSuccessActionBuilder } from '../../action/FetchDevicesAction';
import { fetchLastReadingsErrorActionBuilder, fetchLastReadingsStartActionBuilder, fetchLastReadingsSuccessActionBuilder } from '../../action/FetchLastReadingsAction';
import { updateCurrentDeviceActionBuilder } from '../../action/UpdateCurrentDeviceAction';
import { userDevicesList } from '../../book/UserDevicesList';
import { userLastReadings } from '../../book/UserLastReadings';
import { userRenewAccessToken, UserRenewAccessTokenResponse } from '../../book/UserRenewAccessToken';
import { AppState } from '../../entity/AppState';
import { Device } from '../../entity/Device';
import { LoadingState } from '../../entity/LoadingState';
import { LoginToken } from '../../entity/LoginToken';
import { ServiceResponse } from '../../entity/ServiceResponse';
import { Dashboard, DashboardProps } from './Dashboard';

export const DashboardContainer = connect(
    (appState: AppState): DashboardProps => {
        return {
            lastReadingLoadingState: appState.lastReadingLoadingState,
            token: appState.token,
            airQualityData: appState.lastReadings,
            airStatus: appState.airStatus,
            airStatusAverage: appState.airStatusAverage,
            meterUnit: appState.settings.meterUnit,
            currentDevice: appState.currentDevice,
            devicesData: appState.devicesData,
            suggestions: appState.suggestions,
            decimalSeparator: appState.settings.decimalSeparator,
            iconVisualizationType: appState.settings.iconVisualizationType,
            isLoading: appState.lastReadingLoadingState === LoadingState.loading
                || appState.devicesData.loadingState === LoadingState.loading,
            dateFormat: appState.settings.dateFormat
        } as DashboardProps;
    },
    (dispatch: Dispatch): DashboardProps => {
        return {
            onCurrentDeviceChange: (device: Device) => { dispatch(updateCurrentDeviceActionBuilder(device)); },
            fetchDevices: (token: LoginToken) => {
                dispatch(fetchDevicesStartActionBuilder());

                const renewToken: Promise<ServiceResponse<UserRenewAccessTokenResponse>> = token.expiredAt <= Date.now() ? userRenewAccessToken(token.refreshToken) : Promise.resolve({ payload: { accessToken: token.accessToken, expiredAt: token.expiredAt } });

                renewToken
                    .then(response => {
                        if (response.error) {
                            console.log("Error renew token: ", response.error);
                            dispatch(fetchDevicesErrorActionBuilder(response.error));
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
                                console.error(`Error while fetch devices: ${error}`);

                                dispatch(fetchDevicesErrorActionBuilder(error));
                            });
                    })
                    .catch(err => {
                        dispatch(fetchDevicesErrorActionBuilder(err));
                    });
            },
            fetchAirQualityData: (token: LoginToken, currentDeviceId: string) => {
                const poller = () => {
                    dispatch(fetchLastReadingsStartActionBuilder());

                    const renewToken: Promise<ServiceResponse<UserRenewAccessTokenResponse>> = token.expiredAt <= Date.now() ? userRenewAccessToken(token.refreshToken) : Promise.resolve({ payload: { accessToken: token.accessToken, expiredAt: token.expiredAt } });

                    renewToken
                        .then(response => {
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
                                        dispatch(fetchLastReadingsErrorActionBuilder(response.error));
                                        return;
                                    }

                                    dispatch(fetchLastReadingsSuccessActionBuilder(response.payload));

                                    setTimeout(() => poller(), parseInt(process.env.REACT_APP_AIR_QUALITY_DATA_REFRESH_TIME as string));
                                })
                                .catch((error) => {
                                    console.error(`Error while fetch air quality data: ${error}`);

                                    dispatch(fetchLastReadingsErrorActionBuilder(error));
                                });
                        })
                        .catch(err => {
                            dispatch(fetchLastReadingsErrorActionBuilder(err));
                        });
                };

                poller();
            }
        } as DashboardProps;
    }
)(Dashboard);