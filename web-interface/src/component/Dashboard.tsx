import React, { useEffect, FunctionComponent } from 'react';
import 'react-alice-carousel/lib/alice-carousel.css';
import { averageAirStatus } from "../book/AverageAirStatus";
import { AirQualityData } from '../entity/AirQualityData';
import { AirStatus } from "../entity/AirStatus";
import { Device } from "../entity/Device";
import { MeterUnit } from '../entity/MeterUnit';
import { AppDrawer } from './AppDrawer';
import './Dashboard.scss';
import { DashboardHeader } from './DashboardHeader';
import { DeviceAirQualityData } from './DeviceAirQualityData';
import { Weather } from './Weather';

export const Dashboard: FunctionComponent<DashboardProps> = (props) => {
    useEffect(() => { props.fetchDevices(props.secretKey); }, []);
    useEffect(() => {
        if (props.currentDeviceId)
            props.fetchAirQualityData(props.currentDeviceId, props.secretKey);
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

        <Weather />

        <DeviceAirQualityData
            airQualityData={props.airQualityData}
            airStatus={props.airStatus}
            decimalSeparator={props.decimalSeparator}
            meterUnit={props.meterUnit} />
    </div>;
};

export interface DashboardProps {
    secretKey: string;

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