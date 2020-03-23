import { connect } from 'react-redux';
import { RouteChildrenProps } from 'react-router-dom';
import { Dispatch } from 'redux';
import { ReadingTypes } from '../../book/ReadingTypes';
import { celsiusToFahrenheit } from '../../book/TemperatureConverter';
import { TemperatureUnit } from '../../book/Unit';
import { userRenewAccessToken, UserRenewAccessTokenResponse } from '../../book/UserRenewAccessToken';
import { userTimeRangeReadings } from '../../book/UserTimeRangeReadings';
import { Granularity } from '../../entity/Granularity';
import { LoginToken } from '../../entity/LoginToken';
import { ServiceResponse } from '../../entity/ServiceResponse';
import { fetchTimeRangeErrorActionBuilder, fetchTimeRangeStartActionBuilder, fetchTimeRangeSuccessActionBuilder } from './../../action/FetchTimeRangeAction';
import { AppState } from './../../entity/AppState';
import { Settings } from './../../entity/Settings';
import { Charts, ChartsProps } from './Charts';

const getTitle = (readingType: string): string => {
    switch (readingType) {
        case ReadingTypes.TVOC: return 'TVOC';
        case ReadingTypes.PRESSURE: return 'Pressure';
        case ReadingTypes.HUMIDITY: return 'Humidity';
        case ReadingTypes.TEMPERATURE: return 'Temperature';
        case ReadingTypes.CO2: return 'CO2';
    }
    return '';
};
const getUnitMeter = (readingType: string, settings: Settings): string => {
    switch (readingType) {
        case ReadingTypes.TVOC: return settings.meterUnit.tvoc;
        case ReadingTypes.PRESSURE: return settings.meterUnit.pressure;
        case ReadingTypes.HUMIDITY: return settings.meterUnit.humidity;
        case ReadingTypes.TEMPERATURE: return settings.meterUnit.temperature === TemperatureUnit.CELSIUS ? "°C" : "°F";
        case ReadingTypes.CO2: return settings.meterUnit.co2;
    }
    return '';
};

export const ChartsContainer = connect(
    (appState: AppState, ownProps: RouteChildrenProps): Partial<ChartsProps> => {
        const readingType = ownProps.match ? (ownProps.match.params as any).readingType : undefined;

        return {
            airQualityDataAverages: appState.airQualityDataAverages,
            token: appState.loginTokenStatus.loginToken as LoginToken,
            deviceId: appState.currentDevice?.deviceId,
            title: getTitle(readingType),
            formatValue: (value: number): string => {
                switch (readingType) {
                    case ReadingTypes.TVOC:
                    case ReadingTypes.PRESSURE:
                    case ReadingTypes.HUMIDITY:
                    case ReadingTypes.CO2:
                        return value
                            .toFixed(0)
                            .replace('.', appState.settings.decimalSeparator);
                    case ReadingTypes.TEMPERATURE:
                        return (appState.settings.meterUnit.temperature === TemperatureUnit.CELSIUS ? value : celsiusToFahrenheit(value))
                            .toFixed(1)
                            .replace(".", appState.settings.decimalSeparator);
                }
                return '';
            },
            unitMeter: getUnitMeter(readingType, appState.settings),
            dateFormat: appState.settings.dateFormat,
            shortDateFormat: appState.settings.shortDateFormat,
        } as ChartsProps;
    },
    (dispatch: Dispatch): ChartsProps => {
        return {
            fetchAverages: (token: LoginToken, deviceId: string, measurementType: string, timestamp: number | undefined) => {
                dispatch(fetchTimeRangeStartActionBuilder());

                const renewToken: Promise<ServiceResponse<UserRenewAccessTokenResponse>> = token.expiredAt <= Date.now() ?
                    userRenewAccessToken(token.refreshToken) :
                    Promise.resolve({ payload: { accessToken: token.accessToken, expiredAt: token.expiredAt } });

                renewToken
                    .then(response => {
                        if (response.error || !response.payload) {
                            console.log(response.error);
                            return;
                        }

                        return userTimeRangeReadings(deviceId, response.payload?.accessToken, measurementType, timestamp)
                            .then(response => {
                                if (response.error) {
                                    dispatch(fetchTimeRangeErrorActionBuilder(response.error));
                                    return;
                                }

                                if (!response.payload) {
                                    dispatch(fetchTimeRangeErrorActionBuilder(0));
                                    return;
                                }

                                dispatch(fetchTimeRangeSuccessActionBuilder(
                                    response.payload.timeRangeReadings.filter(m => m.granularity === Granularity.yearly) || [],
                                    response.payload.timeRangeReadings.filter(m => m.granularity === Granularity.monthly) || [],
                                    response.payload.timeRangeReadings.filter(m => m.granularity === Granularity.daily) || []
                                ));
                            })
                            .catch(error => {
                                console.error(error);
                                dispatch(fetchTimeRangeErrorActionBuilder(error));
                            });
                    })
                    .catch(error => {
                        console.error(error);
                        dispatch(fetchTimeRangeErrorActionBuilder(error));
                    });
            }
        } as ChartsProps;
    }
)(Charts);