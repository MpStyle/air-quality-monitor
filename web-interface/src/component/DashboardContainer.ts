import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { fetchAirQualityDataSuccessActionBuilder } from '../action/FetchAirQualityDataSuccessAction';
import { fetchDevicesSuccessActionBuilder } from '../action/FetchDevicesSuccessAction';
import { updateCurrentDeviceActionBuilder } from '../action/UpdateCurrentDeviceAction';
import { userDevicesSearch } from '../book/UserDevicesSearch';
import { userMeasurementsSearch } from '../book/UserMeasurementsSearch';
import { UserNewAccessTokenResponse, userRenewAccessToken } from '../book/UserRenewAccessToken';
import { AirQualityData } from '../entity/AirQualityData';
import { AppState } from '../entity/AppState';
import { Device } from '../entity/Device';
import { LoginToken } from '../entity/LoginToken';
import { ServiceResponse } from '../entity/ServiceResponse';
import { Dashboard, DashboardProps } from './Dashboard';

export const DashboardContainer = connect(
    (appState: AppState): DashboardProps => {
        return {
            airQualityData: appState.airQualityData,
            airStatus: appState.airStatus,
            meterUnit: appState.settings.meterUnit,
            currentDevice: appState.currentDevice,
            devices: appState.devices,
            suggestions: appState.suggestions,
            token: appState.token,
            decimalSeparator: appState.settings.decimalSeparator,
            loadAirQualityData: !!appState.devices.length,
            iconVisualizationType: appState.settings.iconVisualizationType
        } as DashboardProps;
    },
    (dispatch: Dispatch): DashboardProps => {
        return {
            onCurrentDeviceChange: (device: Device) => { dispatch(updateCurrentDeviceActionBuilder(device)); },
            fetchDevices: (token: LoginToken) => {
                const isExpired = Date.now() > token.expiredAt;
                const renewToken: Promise<ServiceResponse<UserNewAccessTokenResponse>> = isExpired ? userRenewAccessToken(token.refreshToken) : Promise.resolve({ payload: { accessToken: token.accessToken, expiresIn: token.expiredAt } });

                renewToken.then(response => {
                    if (response.error) {
                        console.error(`Error while renew access token: ${response.error}`);
                        return;
                    }

                    if (!response.payload) {
                        console.error("Invalid payload");
                        return;
                    }

                    userDevicesSearch(response.payload.accessToken)
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
                });
            },
            fetchAirQualityData: (currentDeviceId: string, token: LoginToken) => {
                const poller = () => {
                    const isExpired = Date.now() > token.expiredAt;
                    const renewToken: Promise<ServiceResponse<UserNewAccessTokenResponse>> = isExpired ? userRenewAccessToken(token.refreshToken) : Promise.resolve({ payload: { accessToken: token.accessToken, expiresIn: token.expiredAt } });

                    renewToken.then(response => {
                        if (response.error) {
                            console.error(`Error while renew access token: ${response.error}`);
                            return;
                        }

                        if (!response.payload) {
                            console.error("Invalid payload");
                            return;
                        }

                        userMeasurementsSearch(currentDeviceId, response.payload.accessToken)
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
                    });
                };

                poller();
            }
        } as DashboardProps;
    }
)(Dashboard);