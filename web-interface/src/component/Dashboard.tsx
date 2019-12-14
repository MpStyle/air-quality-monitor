import Divider from '@material-ui/core/Divider/Divider';
import Paper from '@material-ui/core/Paper/Paper';
import React, { FunctionComponent, useEffect } from 'react';
import 'react-alice-carousel/lib/alice-carousel.css';
import { averageAirStatus } from "../book/AverageAirStatus";
import { epochToFormatedDate } from '../book/DateTimeUtils';
import { AirQualityData } from '../entity/AirQualityData';
import { AirStatus } from "../entity/AirStatus";
import { Device } from "../entity/Device";
import { MeterUnit } from '../entity/MeterUnit';
import co2 from '../images/co2.svg';
import humidity from '../images/humidity.svg';
import noise from '../images/noise.svg';
import pressure from '../images/pressure.svg';
import temperature from '../images/temperature.svg';
import tvoc from '../images/tvoc.svg';
import { AppDrawer } from './AppDrawer';
import './Dashboard.scss';
import { DashboardHeader } from './DashboardHeader';
import { DataRow } from './DataRow';

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
        <AppDrawer isOpen={isAppDrawerOpen} toggleDrawer={toggleDrawer} />

        <DashboardHeader
            devices={props.devices}
            currentDevice={currentDevice}
            average={average}
            areThereDevices={areThereDevices}
            toggleDrawer={toggleDrawer}
            onCurrentDeviceIdChange={props.onCurrentDeviceIdChange}
            suggestions={props.suggestions} />

        <Paper className="air-quality-data">
            <DataRow
                title="Temperature"
                icon={temperature}
                value={props.airQualityData.temperature}
                meter={props.meterUnit.temperature}
                quality={props.airStatus.temperature} />

            <Divider light />

            <DataRow
                title="Humidity"
                icon={humidity}
                value={props.airQualityData.humidity}
                meter={props.meterUnit.humidity}
                quality={props.airStatus.humidity} />

            <Divider light />

            <DataRow
                title="CO2"
                icon={co2}
                value={props.airQualityData.co2}
                meter={props.meterUnit.co2}
                quality={props.airStatus.co2} />

            <Divider light />

            <DataRow
                title="Noise"
                icon={noise}
                value={props.airQualityData.noise}
                meter={props.meterUnit.noise}
                quality={props.airStatus.noise} />

            <Divider light />

            <DataRow
                title="Pressure"
                icon={pressure}
                value={props.airQualityData.pressure}
                meter={props.meterUnit.pressure}
                quality={props.airStatus.pressure} />

            <Divider light />

            <DataRow
                title="TVOC"
                icon={tvoc}
                value={props.airQualityData.tvoc}
                meter={props.meterUnit.tvoc}
                quality={props.airStatus.tvoc} />

            <Divider light />

            <div>{props.airQualityData.inserted && <div className="last-update"><span>Last update:</span> {epochToFormatedDate(props.airQualityData.inserted)}</div>}</div>

        </Paper>
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