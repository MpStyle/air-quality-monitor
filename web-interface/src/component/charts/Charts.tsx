import { CircularProgress } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Paper from "@material-ui/core/Paper/Paper";
import Typography from "@material-ui/core/Typography/Typography";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import * as React from 'react';
import { FunctionComponent, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { DASHBOARD_URL } from "../../book/Pages";
import { StringUtils } from "../../book/StringUtils";
import { AirQualityDataAverages } from "../../entity/AirQualityDataAverages";
import { LoadingState } from "../../entity/LoadingState";
import { AppBarOneRow } from "../common/AppBarOneRow";
import { LoginToken } from './../../entity/LoginToken';
import { Chart } from "./Chart";
import "./Charts.scss";

export const Charts: FunctionComponent<ChartsProps> = (props) => {
    const { readingType } = useParams();

    useEffect(() => {
        props.fetchAverages(props.token, props.deviceId, readingType as string);
    }, []);

    return <div className="charts">
        <AppBarOneRow>
            <IconButton edge="start" color="inherit" aria-label="menu" component={Link} to={DASHBOARD_URL} className="back-button">
                <ArrowBackIosIcon />
            </IconButton>
            <Typography variant="h6">
                {props.title(readingType as string)} ({props.unitMeter(readingType as string)})
            </Typography>
        </AppBarOneRow>
        <main>
            {props.airQualityDataAverages.loadingState === LoadingState.loading && <Paper elevation={2} className="loading">
                <div className="message">Loading...</div>
                <CircularProgress />
            </Paper>}

            {props.airQualityDataAverages.loadingState === LoadingState.success && <Paper elevation={2} className="charts-container">
                <Chart title="Daily" readingUnitMeter={props.unitMeter(readingType as string)} readingType={props.title(readingType as string)} averages={props.airQualityDataAverages.dailyAverages.map(da => {
                    const utcDate = new Date(Date.UTC(parseInt(da.timeRange.substring(0, 4)), parseInt(da.timeRange.substring(4, 6)), parseInt(da.timeRange.substring(6, 8)), parseInt(da.timeRange.substring(8, 10)), 0, 0));
                    return {
                        ...da,
                        average: parseFloat((da.value / da.counter).toFixed(1)),
                        xaxis: utcDate.getHours().toString(),
                        datetime: `${utcDate.getFullYear()}-${StringUtils.padLeft(utcDate.getMonth() + 1, '0', 2)}-${StringUtils.padLeft(utcDate.getDate(), '0', 2)} ${utcDate.getHours()}:00`
                    };
                })} />

                <Chart title="Montly" readingUnitMeter={props.unitMeter(readingType as string)} readingType={props.title(readingType as string)} averages={props.airQualityDataAverages.monthlyAverages.map(da => ({
                    ...da,
                    average: parseFloat((da.value / da.counter).toFixed(1)),
                    xaxis: da.timeRange.substring(4, 6) + '-' + da.timeRange.substring(6),
                    datetime: da.timeRange.substring(0, 4) + '-' + da.timeRange.substring(4, 6) + '-' + da.timeRange.substring(6)
                }))} />

                <Chart title="Yearly" readingUnitMeter={props.unitMeter(readingType as string)} readingType={props.title(readingType as string)} averages={props.airQualityDataAverages.yearlyAverages.map(da => ({
                    ...da,
                    average: parseFloat((da.value / da.counter).toFixed(1)),
                    xaxis: da.timeRange.substring(0, 4) + '-' + da.timeRange.substring(4),
                    datetime: da.timeRange.substring(0, 4) + '-' + da.timeRange.substring(4),
                }))} />
            </Paper>}
        </main>
    </div>;
};

export interface ChartsProps {
    title: (measurementType: string) => string;
    unitMeter: (measurementType: string) => string;
    token: LoginToken;
    deviceId: string;

    airQualityDataAverages: AirQualityDataAverages;

    fetchAverages: (token: LoginToken, deviceId: string, measurementType: string) => void;
}