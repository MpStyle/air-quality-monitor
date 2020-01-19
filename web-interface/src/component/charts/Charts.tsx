import { CircularProgress } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Paper from "@material-ui/core/Paper/Paper";
import Typography from "@material-ui/core/Typography/Typography";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import * as React from 'react';
import { FunctionComponent, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { DASHBOARD_URL } from "../../book/Pages";
import { AirQualityDataAverages } from "../../entity/AirQualityDataAverages";
import { LoadingState } from "../../entity/LoadingState";
import { AppBarOneRow } from "../common/AppBarOneRow";
import { LoginToken } from './../../entity/LoginToken';
import { Chart } from "./Chart";
import "./Charts.scss";

export const Charts: FunctionComponent<ChartsProps> = (props) => {
    const { measurementType } = useParams();

    useEffect(() => {
        props.fetchAverages(props.token, props.deviceId, measurementType as string);
    }, []);

    return <div className="charts">
        <AppBarOneRow>
            <IconButton edge="start" color="inherit" aria-label="menu" component={Link} to={DASHBOARD_URL} className="back-button">
                <ArrowBackIosIcon />
            </IconButton>
            <Typography variant="h6">
                {props.title(measurementType as string)} ({props.unitMeter(measurementType as string)})
            </Typography>
        </AppBarOneRow>
        <main>
            {props.airQualityDataAverages.loadingState === LoadingState.loading && <Paper elevation={2} className="loading">
                <div className="message">Loading...</div>
                <CircularProgress />
            </Paper>}

            {props.airQualityDataAverages.loadingState === LoadingState.success && <Paper elevation={2} className="charts-container">
                <Chart title="Daily" averages={props.airQualityDataAverages.dailyAverages.map(da => ({
                    ...da,
                    average: da.value / da.counter,
                    xaxis: da.timeRange.substring(0, 4) + '-' + da.timeRange.substring(4, 6) + '-' + da.timeRange.substring(6)
                }))} />
                <Chart title="Montly" averages={props.airQualityDataAverages.monthlyAverages.map(da => ({
                    ...da,
                    average: da.value / da.counter,
                    xaxis: da.timeRange.substring(0, 4) + '-' + da.timeRange.substring(4)
                }))} />
                <Chart title="Yearly" averages={props.airQualityDataAverages.yearlyAverages.map(da => ({
                    ...da,
                    average: da.value / da.counter,
                    xaxis: da.timeRange
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