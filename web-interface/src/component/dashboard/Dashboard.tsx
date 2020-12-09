import React, { useEffect, FunctionComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { IconVisualizationType } from '../../book/IconVisualizationType';
import { Pages } from '../../book/Pages';
import { AirQualityData } from '../../entity/AirQualityData';
import { AirQuality, AirStatus } from "../../entity/AirStatus";
import { DateFormat } from '../../entity/DateFormat';
import { Device } from "../../entity/Device";
import { DevicesData } from '../../entity/DevicesData';
import { LoadingState } from '../../entity/LoadingState';
import { LoginToken } from '../../entity/LoginToken';
import { MeterUnit } from '../../entity/MeterUnit';
import { UserDialogContainer } from './UserDialogContainer';
import { DashboardHeader } from './DashboardHeader';
import './Dashboard.scss';
import { DeviceAirQualityData } from './DeviceAirQualityData';

export const Dashboard: FunctionComponent<DashboardProps> = (props) => {
    const [isAppDrawerOpen, setIsAppDrawerOpen] = React.useState(false);
    const { currentDevice, fetchAirQualityData, fetchDevices, token } = props;

    useEffect(() => {
        if (token) {
            fetchDevices(token);
        }
    }, [fetchDevices, token]);
    useEffect(() => {
        if (currentDevice && token) {
            const timeout = setTimeout(() => {
                fetchAirQualityData(token, currentDevice.deviceId);
            }, parseInt(process.env.REACT_APP_AIR_QUALITY_DATA_REFRESH_TIME as string));

            fetchAirQualityData(token, currentDevice.deviceId);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [fetchAirQualityData, token, currentDevice]);

    if (!token) {
        return <Redirect to={Pages.LOGIN_URL} />;
    }

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === "keydown" && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")) {
            return;
        }

        setIsAppDrawerOpen(open);
    };

    return <div className="dashboard">
        <UserDialogContainer
            isOpen={isAppDrawerOpen}
            toggleDrawer={toggleDrawer} />

        <DashboardHeader
            isLoading={props.devicesData.loadingState === LoadingState.loading || props.lastReadingLoadingState === LoadingState.loading}
            currentDevice={props.currentDevice}
            average={props.airStatusAverage}
            toggleUserDialog={toggleDrawer}
            airQualityData={props.airQualityData}
            dateFormat={props.dateFormat}
            suggestions={props.suggestions} />

        <div className="spacer" />

        <DeviceAirQualityData
            airQualityData={props.airQualityData}
            airStatus={props.airStatus}
            decimalSeparator={props.decimalSeparator}
            meterUnit={props.meterUnit}
            iconVisualizationType={props.iconVisualizationType}
            isLoading={props.isLoading} />
    </div>;
};

export interface DashboardProps {
    token: LoginToken;

    decimalSeparator: string;

    airQualityData: AirQualityData;
    airStatus: AirStatus;
    airStatusAverage: AirQuality;
    meterUnit: MeterUnit;

    devicesData: DevicesData;
    suggestions: string[];

    currentDevice: Device | null;

    fetchDevices: (token: LoginToken) => void;
    fetchAirQualityData: (token: LoginToken, currentDeviceId: string) => void;

    iconVisualizationType: IconVisualizationType;

    isLoading: boolean;
    lastReadingLoadingState: LoadingState;

    dateFormat: DateFormat;
}