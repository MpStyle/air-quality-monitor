import { CircularProgress, Divider } from "@material-ui/core";
import Paper from "@material-ui/core/Paper/Paper";
import React, { FunctionComponent } from "react";
import { DateTimeUtils } from "../../book/DateTimeUtils";
import { ReadingTypes } from "../../book/ReadingTypes";
import { celsiusToFahrenheit } from "../../book/TemperatureConverter";
import { TemperatureUnit } from "../../book/Unit";
import { AirQualityData } from "../../entity/AirQualityData";
import { AirStatus } from "../../entity/AirStatus";
import { MeterUnit } from "../../entity/MeterUnit";
import co2 from '../../images/co2.svg';
import humidity from '../../images/humidity.svg';
import pressure from '../../images/pressure.svg';
import temperature from '../../images/temperature.svg';
import tvoc from '../../images/tvoc.svg';
import { DataRow } from "./DataRow";
import "./DeviceAirQualityData.scss";
import { IconVisualizationType } from "../../book/IconVisualizationType";

export const DeviceAirQualityData: FunctionComponent<AirQualityDataProps> = (props) => {
    const noData = !props.airQualityData.temperature &&
        !props.airQualityData.humidity &&
        !props.airQualityData.co2 &&
        !props.airQualityData.pressure &&
        !props.airQualityData.tvoc;

    if (props.isLoading && noData) {
        return <Paper elevation={2} className="loading">
            <div className="message">Loading...</div>
            <CircularProgress />
        </Paper>;
    }

    if (noData) {
        return <Paper elevation={2} className="no-data">
            <div className="message">
                <strong>No data</strong><br />
                Install almost a device to show something.
            </div>
        </Paper>;
    }

    let temperatureValue: string | number = props.meterUnit.temperature === TemperatureUnit.CELSIUS ? props.airQualityData.temperature : celsiusToFahrenheit(props.airQualityData.temperature);
    temperatureValue = temperatureValue.toFixed(1);
    temperatureValue = temperatureValue.replace(".", props.decimalSeparator);

    return < Paper className="air-quality-data" >
        <DataRow
            title="Temperature"
            icon={temperature}
            value={temperatureValue}
            meter={props.meterUnit.temperature === TemperatureUnit.CELSIUS ? "°C" : "°F"}
            quality={props.airStatus.temperature}
            iconVisualizationType={props.iconVisualizationType}
            measurementType={ReadingTypes.TEMPERATURE} />

        <Divider light />

        <DataRow
            title="Humidity"
            icon={humidity}
            value={props.airQualityData.humidity.toFixed(0)}
            meter={props.meterUnit.humidity}
            quality={props.airStatus.humidity}
            iconVisualizationType={props.iconVisualizationType}
            measurementType={ReadingTypes.HUMIDITY} />

        <Divider light />

        <DataRow
            title="CO2"
            icon={co2}
            value={props.airQualityData.co2.toFixed(0)}
            meter={props.meterUnit.co2}
            quality={props.airStatus.co2}
            iconVisualizationType={props.iconVisualizationType}
            measurementType={ReadingTypes.CO2} />

        <Divider light />

        <DataRow
            title="Pressure"
            icon={pressure}
            value={props.airQualityData.pressure.toFixed(0)}
            meter={props.meterUnit.pressure}
            quality={props.airStatus.pressure}
            iconVisualizationType={props.iconVisualizationType}
            measurementType={ReadingTypes.PRESSURE} />

        <Divider light />

        <DataRow
            title="TVOC"
            icon={tvoc}
            value={props.airQualityData.tvoc.toFixed(1).replace(".", props.decimalSeparator)}
            meter={props.meterUnit.tvoc}
            quality={props.airStatus.tvoc}
            iconVisualizationType={props.iconVisualizationType}
            measurementType={ReadingTypes.TVOC} />

        <Divider light />

        <div>
            {props.airQualityData.inserted && <div className="last-update">
                <span>Last update:</span> {DateTimeUtils.epochToFormatedDate(props.airQualityData.inserted, "YYYY-MM-DD HH:mm:ss")}
            </div>}
        </div>

    </Paper >;
};

export interface AirQualityDataProps {
    airQualityData: AirQualityData;
    airStatus: AirStatus;
    meterUnit: MeterUnit;
    decimalSeparator: string;
    iconVisualizationType: IconVisualizationType;
    isLoading: boolean;
}