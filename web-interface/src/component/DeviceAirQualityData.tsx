import { CircularProgress, Divider } from "@material-ui/core";
import Paper from "@material-ui/core/Paper/Paper";
import React, { FunctionComponent } from "react";
import { epochToFormatedDate } from "../book/DateTimeUtils";
import { AirQualityData } from "../entity/AirQualityData";
import { AirStatus } from "../entity/AirStatus";
import { MeterUnit } from "../entity/MeterUnit";
import co2 from '../images/co2.svg';
import humidity from '../images/humidity.svg';
import pressure from '../images/pressure.svg';
import temperature from '../images/temperature.svg';
import tvoc from '../images/tvoc.svg';
import { DataRow } from "./DataRow";
import "./DeviceAirQualityData.scss";

export const DeviceAirQualityData: FunctionComponent<AirQualityDataProps> = (props) => {
    const isLoading = !props.airQualityData.temperature &&
        !props.airQualityData.humidity &&
        !props.airQualityData.co2 &&
        !props.airQualityData.pressure &&
        !props.airQualityData.tvoc;

    if (isLoading) {
        return <Paper elevation={2} className="loading">
            <div className="message">Loading...</div>
            <CircularProgress />
        </Paper>;
    }

    return <Paper className="air-quality-data">
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

        {/* <DataRow
                title="Noise"
                icon={noise}
                value={props.airQualityData.noise}
                meter={props.meterUnit.noise}
                quality={props.airStatus.noise} />

            <Divider light /> */}

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

    </Paper>;
};

export interface AirQualityDataProps {
    airQualityData: AirQualityData;
    airStatus: AirStatus;
    meterUnit: MeterUnit;
}