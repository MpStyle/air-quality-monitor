import { Divider } from "@material-ui/core";
import Paper from "@material-ui/core/Paper/Paper";
import React, { FunctionComponent } from "react";
import { useTranslation } from 'react-i18next';
import { IconVisualizationType } from "../../book/IconVisualizationType";
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
import { LoadingPaper } from "../common/LoadingPaper";
import { DataRow } from "./DataRow";
import "./DeviceAirQualityData.scss";

export const DeviceAirQualityData: FunctionComponent<AirQualityDataProps> = (props) => {
    const { t } = useTranslation();
    const noData = !props.airQualityData.temperature &&
        !props.airQualityData.humidity &&
        !props.airQualityData.co2 &&
        !props.airQualityData.pressure &&
        !props.airQualityData.tvoc;

    if (props.isLoading && noData) {
        return <LoadingPaper message={`${t("loading")}...`} />;
    }

    if (noData) {
        return <Paper elevation={2} className="no-data">
            <div className="message">
                <strong>{t("noData")}</strong><br />
                {t("installADevice")}.
            </div>
        </Paper>;
    }

    let temperatureValue: string | number = props.meterUnit.temperature === TemperatureUnit.CELSIUS ? props.airQualityData.temperature : celsiusToFahrenheit(props.airQualityData.temperature);
    temperatureValue = temperatureValue.toFixed(1);
    temperatureValue = temperatureValue.replace(".", props.decimalSeparator);

    return < Paper className="air-quality-data" >
        <DataRow
            title={t("temperatureTitle")}
            icon={temperature}
            value={temperatureValue}
            meter={props.meterUnit.temperature === TemperatureUnit.CELSIUS ? "°C" : "°F"}
            quality={props.airStatus.temperature}
            iconVisualizationType={props.iconVisualizationType}
            measurementType={ReadingTypes.TEMPERATURE} />

        <Divider light />

        <DataRow
            title={t("humidityTitle")}
            icon={humidity}
            value={props.airQualityData.humidity.toFixed(0)}
            meter={props.meterUnit.humidity}
            quality={props.airStatus.humidity}
            iconVisualizationType={props.iconVisualizationType}
            measurementType={ReadingTypes.HUMIDITY} />

        <Divider light />

        <DataRow
            title={t("co2Title")}
            icon={co2}
            value={props.airQualityData.co2.toFixed(0)}
            meter={props.meterUnit.co2}
            quality={props.airStatus.co2}
            iconVisualizationType={props.iconVisualizationType}
            measurementType={ReadingTypes.CO2} />

        <Divider light />

        <DataRow
            title={t("pressureTitle")}
            icon={pressure}
            value={props.airQualityData.pressure.toFixed(0)}
            meter={props.meterUnit.pressure}
            quality={props.airStatus.pressure}
            iconVisualizationType={props.iconVisualizationType}
            measurementType={ReadingTypes.PRESSURE} />

        <Divider light />

        <DataRow
            title={t("tvocTitle")}
            icon={tvoc}
            value={props.airQualityData.tvoc.toFixed(1).replace(".", props.decimalSeparator)}
            meter={props.meterUnit.tvoc}
            quality={props.airStatus.tvoc}
            iconVisualizationType={props.iconVisualizationType}
            measurementType={ReadingTypes.TVOC} />

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