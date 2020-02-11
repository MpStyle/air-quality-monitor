import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { fetchAirQualityDataErrorActionBuilder, fetchAirQualityDataStartActionBuilder, fetchAirQualityDataSuccessActionBuilder } from '../../action/FetchAirQualityDataAction';
import { fetchDevicesErrorActionBuilder, fetchDevicesStartActionBuilder, fetchDevicesSuccessActionBuilder } from '../../action/FetchDevicesAction';
import { fetchSuggestionsStartActionBuilder, fetchSuggestionsSuccessActionBuilder } from '../../action/FetchSuggestions';
import { updateCurrentDeviceActionBuilder } from '../../action/UpdateCurrentDeviceAction';
import { co2Quality, humidityQuality, temperatureQuality, tvocQuality } from '../../book/AirQuality';
import { userDevicesList } from '../../book/UserDevicesList';
import { userLastReadings } from '../../book/UserLastReadings';
import { userRenewAccessToken, UserRenewAccessTokenResponse } from '../../book/UserRenewAccessToken';
import { AirQualityData } from '../../entity/AirQualityData';
import { AirQuality } from '../../entity/AirStatus';
import { AppState } from '../../entity/AppState';
import { Device } from '../../entity/Device';
import { LoadingState } from '../../entity/LoadingState';
import { LoginToken } from '../../entity/LoginToken';
import { ServiceResponse } from '../../entity/ServiceResponse';
import { fetchSuggestionsErrorActionBuilder } from './../../action/FetchSuggestions';
import { userSuggestions } from './../../book/UserSuggestions';
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
            suggestions: appState.suggestionsData.suggestions,
            decimalSeparator: appState.settings.decimalSeparator,
            iconVisualizationType: appState.settings.iconVisualizationType,
            isLoading: appState.airQualityData.loadingState === LoadingState.loading
                || appState.devicesData.loadingState === LoadingState.loading
                || appState.suggestionsData.loadingState === LoadingState.loading
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

                                dispatch(fetchSuggestionsStartActionBuilder());

                                userSuggestions({
                                    co2: co2Quality(response.payload?.co2 as number),
                                    humidity: humidityQuality(response.payload?.humidity as number),
                                    pressure: AirQuality.Excellent,
                                    temperature: temperatureQuality(response.payload?.temperature as number),
                                    tvoc: tvocQuality(response.payload?.tvoc as number),
                                })
                                    .then(response => {
                                        if (response.error) {
                                            console.log(response.error);
                                            dispatch(fetchSuggestionsErrorActionBuilder(response.error));
                                            return;
                                        }

                                        dispatch(fetchSuggestionsSuccessActionBuilder(response.payload?.suggestions || []));
                                    })
                                    .catch(error => {
                                        console.log(`Error while fetch suggestions: ${error}`);
                                        dispatch(fetchSuggestionsErrorActionBuilder(error));
                                    });

                                setTimeout(() => poller(), parseInt(process.env.REACT_APP_AIR_QUALITY_DATA_REFRESH_TIME as string));
                            })
                            .catch((error) => {
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