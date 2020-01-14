import React, { FunctionComponent, useEffect } from 'react';
import 'react-alice-carousel/lib/alice-carousel.css';
import { averageAirStatus } from "../../book/AverageAirStatus";
import { AirQualityData } from '../../entity/AirQualityData';
import { AirStatus } from "../../entity/AirStatus";
import { Device } from "../../entity/Device";
import { LoginToken } from '../../entity/LoginToken';
import { MeterUnit } from '../../entity/MeterUnit';
import { AppDrawer } from '../common/AppDrawer';
import './Dashboard.scss';
import { DashboardHeader } from './DashboardHeader';
import { DeviceAirQualityData } from './DeviceAirQualityData';

export const Dashboard: FunctionComponent<DashboardProps> = (props) => {
    useEffect(() => {
        props.fetchDevices(props.token);
    }, []);
    useEffect(() => {
        if (props.loadAirQualityData && props.currentDevice) {
            props.fetchAirQualityData(props.currentDevice.deviceId, props.token);
        }
    }, [props.loadAirQualityData, props.currentDevice]);

    const average = averageAirStatus(props.airStatus);
    const currentDevice = props.devices.find(d => d.deviceId === props.currentDevice?.deviceId);

    const [isAppDrawerOpen, setIsAppDrawerOpen] = React.useState(false);

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === "keydown" && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")) {
            return;
        }

        setIsAppDrawerOpen(open);
    };

    return <div className="dashboard">
        <AppDrawer
            currentDevice={currentDevice}
            isOpen={isAppDrawerOpen}
            average={average}
            refreshToken={props.token?.refreshToken}
            deviceLastUpdate={props.airQualityData.inserted}
            toggleDrawer={toggleDrawer} />

        <DashboardHeader
            devices={props.devices}
            currentDevice={currentDevice}
            average={average}
            toggleDrawer={toggleDrawer}
            onCurrentDeviceChange={props.onCurrentDeviceChange}
            suggestions={props.suggestions} />

        <div className="spacer" />

        <DeviceAirQualityData
            airQualityData={props.airQualityData}
            airStatus={props.airStatus}
            decimalSeparator={props.decimalSeparator}
            meterUnit={props.meterUnit}
            iconVisualizationType={props.iconVisualizationType} />
    </div>;
};

export interface DashboardProps {
    loadAirQualityData: boolean;

    token: LoginToken;

    decimalSeparator: string;

    airQualityData: AirQualityData;
    airStatus: AirStatus;
    meterUnit: MeterUnit;

    devices: Device[];
    suggestions: string[];

    currentDevice: Device | null;
    onCurrentDeviceChange: (device: Device) => void;

    fetchDevices: (token: LoginToken) => void;
    fetchAirQualityData: (currentDeviceId: string, token: LoginToken) => void;

    iconVisualizationType: string;
}