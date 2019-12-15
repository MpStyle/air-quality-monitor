import React, { FunctionComponent, useEffect } from 'react';
import 'react-alice-carousel/lib/alice-carousel.css';
import { averageAirStatus } from "../book/AverageAirStatus";
import { AirQualityData } from '../entity/AirQualityData';
import { AirStatus } from "../entity/AirStatus";
import { Device } from "../entity/Device";
import { MeterUnit } from '../entity/MeterUnit';
import { DeviceAirQualityData } from './DeviceAirQualityData';
import { AppDrawer } from './AppDrawer';
import './Dashboard.scss';
import { DashboardHeader } from './DashboardHeader';

export const Dashboard: FunctionComponent<HomeProps> = (props) => {
    useEffect(() => { props.fetchDevices(); }, []);
    useEffect(() => {
        if (props.currentDeviceId)
            props.fetchAirQualityData(props.currentDeviceId as string);
    }, [props.currentDeviceId]);

    const average = averageAirStatus(props.airStatus);
    const areThereDevices = !!(props.devices && props.devices.length);
    const currentDevice = props.devices.find(d => d.id === props.currentDeviceId);

    const [isAppDrawerOpen, setIsAppDrawerOpen] = React.useState(false);

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === "keydown" && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")) {
            return;
        }

        setIsAppDrawerOpen(open);
    };

    return <div className="dashboard">
        <AppDrawer
            isOpen={isAppDrawerOpen}
            toggleDrawer={toggleDrawer} />

        <DashboardHeader
            devices={props.devices}
            currentDevice={currentDevice}
            average={average}
            areThereDevices={areThereDevices}
            toggleDrawer={toggleDrawer}
            onCurrentDeviceIdChange={props.onCurrentDeviceIdChange}
            suggestions={props.suggestions} />

        <DeviceAirQualityData
            airQualityData={props.airQualityData}
            airStatus={props.airStatus}
            meterUnit={props.meterUnit} />
    </div>;
};

export interface HomeProps {
    airQualityData: AirQualityData;
    airStatus: AirStatus;
    meterUnit: MeterUnit;

    devices: Device[];
    suggestions: string[];

    currentDeviceId: string | null;
    onCurrentDeviceIdChange: (deviceId: string) => void;

    fetchDevices: () => void;
    fetchAirQualityData: (currentDeviceId: string) => void;
}