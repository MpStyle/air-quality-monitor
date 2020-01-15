import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { TemperatureUnit } from '../../book/Unit';
import { userRenewAccessToken, UserRenewAccessTokenResponse } from '../../book/UserRenewAccessToken';
import { userTimeRangeMeasurementsSearch } from '../../book/UserTimeRangeMeasurementsSearch';
import { Granularity } from '../../entity/Granularity';
import { LoginToken } from '../../entity/LoginToken';
import { ServiceResponse } from '../../entity/ServiceResponse';
import { fetchTimeRangeStartActionBuilder, fetchTimeRangeSuccessActionBuilder } from './../../action/FetchTimeRangeAction';
import { MeasurementTypes } from './../../book/MeasurementTypes';
import { AppState } from './../../entity/AppState';
import { Charts, ChartsProps } from './Charts';

export const ChartsContainer = connect(
    (appState: AppState): ChartsProps => {
        return {
            airQualityDataAverages: appState.airQualityDataAverages,
            token: appState.token,
            deviceId: appState.currentDevice?.deviceId,
            title: (measurementType: string): string => {
                switch (measurementType) {
                    case MeasurementTypes.TVOC: return 'TVOC';
                    case MeasurementTypes.PRESSURE: return 'Pressure';
                    case MeasurementTypes.HUMIDITY: return 'Humidity';
                    case MeasurementTypes.TEMPERATURE: return 'Temperature';
                    case MeasurementTypes.CO2: return 'CO2';
                }
                return '';
            },
            unitMeter: (measurementType: string): string => {
                switch (measurementType) {
                    case MeasurementTypes.TVOC: return appState.settings.meterUnit.tvoc;
                    case MeasurementTypes.PRESSURE: return appState.settings.meterUnit.pressure;
                    case MeasurementTypes.HUMIDITY: return appState.settings.meterUnit.humidity;
                    case MeasurementTypes.TEMPERATURE: return appState.settings.meterUnit.temperature === TemperatureUnit.CELSIUS ? "°C" : "°F";
                    case MeasurementTypes.CO2: return appState.settings.meterUnit.co2;
                }
                return '';
            }
        } as ChartsProps;
    },
    (dispatch: Dispatch): ChartsProps => {
        return {
            fetchAverages: (token: LoginToken, deviceId: string, measurementType: string) => {
                dispatch(fetchTimeRangeStartActionBuilder());

                const isExpired = Date.now() > token.expiredAt;
                const renewToken: Promise<ServiceResponse<UserRenewAccessTokenResponse>> = isExpired ? userRenewAccessToken(token.refreshToken) : Promise.resolve({ payload: { accessToken: token.accessToken, expiresIn: token.expiredAt } });

                renewToken
                    .then(response => {
                        if (response.error || !response.payload) {
                            console.log(response.error);
                            return;
                        }

                        return userTimeRangeMeasurementsSearch(deviceId, response.payload?.accessToken, measurementType)
                            .then(response => {
                                dispatch(fetchTimeRangeSuccessActionBuilder(
                                    response.payload?.timeRangeMeasurements.filter(m => m.granularity === Granularity.yearly) || [],
                                    response.payload?.timeRangeMeasurements.filter(m => m.granularity === Granularity.monthly) || [],
                                    response.payload?.timeRangeMeasurements.filter(m => m.granularity === Granularity.daily) || []
                                ));
                            })
                            .catch(error => console.error(error));
                    })
                    .catch(error => console.error(error));
            }
        } as ChartsProps;
    }
)(Charts);