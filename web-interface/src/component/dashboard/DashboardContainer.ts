import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { fetchDevicesErrorActionBuilder, fetchDevicesStartActionBuilder, fetchDevicesSuccessActionBuilder } from '../../action/FetchDevicesAction';
import { fetchLastReadingsErrorActionBuilder, fetchLastReadingsStartActionBuilder, fetchLastReadingsSuccessActionBuilder } from '../../action/FetchLastReadingsAction';
import { fetchLoginTokenErrorActionBuilder, fetchLoginTokenStartActionBuilder, fetchLoginTokenSuccessActionBuilder } from '../../action/FetchLoginTokenAction';
import { userDevicesList } from '../../book/UserDevicesList';
import { userLastReadings } from '../../book/UserLastReadings';
import { userRenewAccessToken } from '../../book/UserRenewAccessToken';
import { AppState } from '../../entity/AppState';
import { LoadingState } from '../../entity/LoadingState';
import { LoginToken } from '../../entity/LoginToken';
import { Dashboard, DashboardProps } from './Dashboard';

export const DashboardContainer = connect(
    (appState: AppState): DashboardProps => {
        return {
            lastReadingLoadingState: appState.lastReadingLoadingState,
            token: appState.loginTokenStatus.loginToken,
            airQualityData: appState.lastReadings,
            airStatus: appState.airStatus,
            airStatusAverage: appState.airStatusAverage,
            meterUnit: appState.settings.meterUnit,
            currentDevice: appState.currentDevice,
            devicesData: appState.devicesData,
            suggestions: appState.suggestions,
            decimalSeparator: appState.settings.decimalSeparator,
            iconVisualizationType: appState.settings.iconVisualizationType,
            isLoading: appState.loginTokenStatus.loadingState === LoadingState.loading || appState.lastReadingLoadingState === LoadingState.loading || appState.devicesData.loadingState === LoadingState.loading,
            dateFormat: appState.settings.dateFormat
        } as DashboardProps;
    },
    (dispatch: Dispatch): DashboardProps => {
        const renewToken = (token: LoginToken) => {
            dispatch(fetchLoginTokenStartActionBuilder());

            userRenewAccessToken(token.refreshToken)
                .then(response => {
                    if (response.error) {
                        console.error("Error renew token: ", response.error);
                        dispatch(fetchLoginTokenErrorActionBuilder(response.error));
                        return;
                    }

                    if (!response.payload) {
                        console.error("Error renew token: ", "invalid payload");
                        dispatch(fetchLoginTokenErrorActionBuilder("invalid payload"));
                        return;
                    }

                    dispatch(fetchLoginTokenSuccessActionBuilder({
                        ...token,
                        accessToken: response.payload.accessToken,
                        expiredAt: response.payload.expiredAt
                    } as LoginToken));
                });
        };

        return {
            fetchDevices: (token: LoginToken) => {
                if (token.expiredAt <= Date.now()) {
                    renewToken(token);
                    return;
                }

                dispatch(fetchDevicesStartActionBuilder());
                userDevicesList(token.accessToken)
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
            },
            fetchAirQualityData: (token: LoginToken, currentDeviceId: string) => {
                if (token.expiredAt <= Date.now()) {
                    renewToken(token);
                    return;
                }

                dispatch(fetchLastReadingsStartActionBuilder());
                userLastReadings(currentDeviceId, token.accessToken)
                    .then(response => {
                        if (response.error) {
                            console.log(response.error);
                            dispatch(fetchLastReadingsErrorActionBuilder(response.error));
                            return;
                        }

                        dispatch(fetchLastReadingsSuccessActionBuilder(response.payload));
                    })
                    .catch((error) => {
                        console.error(`Error while fetch air quality data: ${error}`);

                        dispatch(fetchLastReadingsErrorActionBuilder(error));
                    });
            }
        } as DashboardProps;
    }
)(Dashboard);