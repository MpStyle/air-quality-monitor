import React, { FunctionComponent, useEffect } from 'react';
import 'react-alice-carousel/lib/alice-carousel.css';
import { averageAirStatus } from "../book/AverageAirStatus";
import { AirQualityData } from '../entity/AirQualityData';
import { AirStatus } from "../entity/AirStatus";
import { Device } from "../entity/Device";
import { LoginToken } from '../entity/LoginToken';
import { MeterUnit } from '../entity/MeterUnit';
import { AppDrawer } from './AppDrawer';
import './Dashboard.scss';
import { DashboardHeader } from './DashboardHeader';
import { DeviceAirQualityData } from './DeviceAirQualityData';

export const Dashboard: FunctionComponent<DashboardProps> = (props) => {
    useEffect(() => {
        props.fetchDevices(props.token.accessToken);
    }, []);
    useEffect(() => {
        if (props.currentDeviceId) {
            props.fetchAirQualityData(props.currentDeviceId, props.token.accessToken);
        }
    }, [props.currentDeviceId]);

    const average = averageAirStatus(props.airStatus);
    const areThereDevices = !!(props.devices && props.devices.length);
    const currentDevice = props.devices.find(d => d.deviceId === props.currentDeviceId);

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
            areThereDevices={areThereDevices}
            toggleDrawer={toggleDrawer}
            onCurrentDeviceIdChange={props.onCurrentDeviceIdChange}
            suggestions={props.suggestions} />

        <div className="spacer" />

        <DeviceAirQualityData
            airQualityData={props.airQualityData}
            airStatus={props.airStatus}
            decimalSeparator={props.decimalSeparator}
            meterUnit={props.meterUnit} />
    </div>;
};

export interface DashboardProps {
    token: LoginToken;

    decimalSeparator: string;

    airQualityData: AirQualityData;
    airStatus: AirStatus;
    meterUnit: MeterUnit;

    devices: Device[];
    suggestions: string[];

    currentDeviceId: string | null;
    onCurrentDeviceIdChange: (deviceId: string) => void;

    fetchDevices: (secretKey: string) => void;
    fetchAirQualityData: (currentDeviceId: string, secretKey: string) => void;
}