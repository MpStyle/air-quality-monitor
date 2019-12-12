import Divider from '@material-ui/core/Divider/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper/Paper';
import Select from '@material-ui/core/Select';
import React, { useEffect, FunctionComponent } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { airQualityToLabel } from "../book/AirQualityToLabel";
import { averageAirStatus } from "../book/AverageAirStatus";
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
import './Dashboard.scss';
import { DataRow } from './DataRow';

export const Dashboard: FunctionComponent<HomeProps> = (props) => {
    useEffect(() => { props.fetchDevices(); }, []);
    useEffect(() => { if (props.currentDeviceId) props.fetchAirQualityData(props.currentDeviceId as string); }, [props.currentDeviceId]);

    const average = averageAirStatus(props.airStatus);
    const areThereDevices = !!(props.devices && props.devices.length);

    return <div className="dashboard">
        <div className="header">
            <div>
                {areThereDevices && <Select
                    value={props.currentDeviceId || (props.devices && props.devices.length && props.devices[0].id)}
                    onChange={event => props.onCurrentDeviceIdChange(event.target.value as string)}>
                    {props.devices.map((device) => (
                        <MenuItem key={device.id} value={device.id}>{device.name}</MenuItem>
                    ))}
                </Select>}
            </div>
            <div>
                {airQualityToLabel(average)}
            </div>
            <div>
                {props.suggestions && props.suggestions.length > 0 && <AliceCarousel autoPlayInterval={6000} buttonsDisabled={true} autoPlay={true}>
                    {props.suggestions.map((s, i) => <div key={`slide-${i}`}>{s}</div>)}
                </AliceCarousel >}
            </div>
        </div>
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