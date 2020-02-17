import React, { FunctionComponent, useEffect } from 'react';
import 'react-alice-carousel/lib/alice-carousel.css';
import { AirQualityData } from '../../entity/AirQualityData';
import { AirQuality, AirStatus } from "../../entity/AirStatus";
import { Device } from "../../entity/Device";
import { DevicesData } from '../../entity/DevicesData';
import { LoadingState } from '../../entity/LoadingState';
import { LoginToken } from '../../entity/LoginToken';
import { MeterUnit } from '../../entity/MeterUnit';
import { AppDrawerContainer } from '../common/AppDrawerContainer';
import './Dashboard.scss';
import { DashboardHeader } from './DashboardHeader';
import { DeviceAirQualityData } from './DeviceAirQualityData';

export const Dashboard: FunctionComponent<DashboardProps> = (props) => {
    const [isAppDrawerOpen, setIsAppDrawerOpen] = React.useState(false);

    useEffect(() => {
        props.fetchDevices(props.token);
    }, []);
    useEffect(() => {
        if (props.currentDevice) {
            props.fetchAirQualityData(props.token, props.currentDevice.deviceId);
        }
    }, [props.currentDevice]);

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === "keydown" && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")) {
            return;
        }

        setIsAppDrawerOpen(open);
    };

    return <div className="dashboard">
        <AppDrawerContainer
            isOpen={isAppDrawerOpen}
            toggleDrawer={toggleDrawer} />

        <DashboardHeader
            isLoading={props.devicesData.loadingState === LoadingState.loading || props.lastReadingLoadingState === LoadingState.loading}
            devices={props.devicesData.devices}
            currentDevice={props.currentDevice}
            average={props.airStatusAverage}
            toggleDrawer={toggleDrawer}
            onCurrentDeviceChange={props.onCurrentDeviceChange}
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
    onCurrentDeviceChange: (device: Device) => void;

    fetchDevices: (token: LoginToken) => void;
    fetchAirQualityData: (token: LoginToken, currentDeviceId: string) => void;

    iconVisualizationType: string;

    isLoading: boolean;
    lastReadingLoadingState: LoadingState;
}