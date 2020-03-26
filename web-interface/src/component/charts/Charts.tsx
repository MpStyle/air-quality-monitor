import MomentUtils from '@date-io/moment';
import IconButton from "@material-ui/core/IconButton/IconButton";
import Paper from "@material-ui/core/Paper/Paper";
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from "@material-ui/core/Typography/Typography";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import InsertInvitationIcon from '@material-ui/icons/InsertInvitation';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import React, { useEffect, useState, FunctionComponent } from "react";
import { useHistory, useParams } from "react-router-dom";
import { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link, useParams } from "react-router-dom";
import { DateTimeUtils } from '../../book/DateTimeUtils';
import { AirQualityDataAverages } from "../../entity/AirQualityDataAverages";
import { DateFormat } from '../../entity/DateFormat';
import { LoadingState } from "../../entity/LoadingState";
import { ShortDateFormat } from '../../entity/ShortDateFormat';
import { AppBarOneRow } from "../common/AppBarOneRow";
import { LoadingPaper } from '../common/LoadingPaper';
import { LoginToken } from './../../entity/LoginToken';
import { Chart } from "./Chart";
import "./Charts.scss";

const useStyles = makeStyles(() =>
    createStyles({
        grow: {
            flexGrow: 1,
        },
    }));

export const Charts: FunctionComponent<ChartsProps> = (props) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { readingType, currentDeviceId } = useParams();
    const history = useHistory();
    const [selectedTimestamp, setSelectedTimestamp] = useState<number>(Date.now());
    const [isCalendarVisible, setIsCalendarVisible] = useState<boolean>(false);
    const { fetchAverages, token, deviceId } = props;

    useEffect(() => {
        fetchAverages(token, currentDeviceId ?? deviceId, readingType as string, Date.now());
    }, [fetchAverages, token, deviceId, currentDeviceId, readingType]);

    return <div className="charts">
        <AppBarOneRow>
            <IconButton edge="start" color="inherit" aria-label="go back" onClick={() => history.goBack()} className="back-button">
                <ArrowBackIosIcon />
            </IconButton>
            <Typography variant="h6">
                {props.title} ({props.unitMeter})
            </Typography>
            <div className={classes.grow} />
            <IconButton edge="start" color="inherit" aria-label="select date" className="select-date-button" onClick={() => setIsCalendarVisible(!isCalendarVisible)}>
                <InsertInvitationIcon />
            </IconButton>
        </AppBarOneRow>
        <main>
            {props.airQualityDataAverages.loadingState === LoadingState.loading && <LoadingPaper message="Loading..." />}
                <div className="message">{t("loading")}...</div>
                <CircularProgress />
            </Paper>}

            {props.airQualityDataAverages.loadingState === LoadingState.success && <Paper elevation={2} className="charts-container">

                <div className="date-picker-container">
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <DatePicker
                            open={isCalendarVisible}
                            className="date-picker"
                            autoOk
                            variant="dialog"
                            inputVariant="outlined"
                            label="Select date"
                            format="YYYY-MM-DD"
                            value={new Date(selectedTimestamp)}
                            TextFieldComponent={() => <React.Fragment />}
                            onChange={date => {
                                const choosedDate = date?.toDate().getTime() ?? Date.now();
                                setSelectedTimestamp(choosedDate);
                                setIsCalendarVisible(false);
                                props.fetchAverages(props.token, currentDeviceId ?? props.deviceId, readingType as string, choosedDate);
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </div>

                <Chart
                    title="Hourly"
                    subtitle={DateTimeUtils.timestampToDate(selectedTimestamp, props.dateFormat)}
                    readingUnitMeter={props.unitMeter}
                    readingType={props.title}
                    averages={props.airQualityDataAverages.dailyAverages.map(da => {
                        const utcDate = DateTimeUtils.localeDateToTimestamp(new Date(Date.UTC(parseInt(da.timeRange.substring(0, 4)), parseInt(da.timeRange.substring(4, 6)) - 1, parseInt(da.timeRange.substring(6, 8)), parseInt(da.timeRange.substring(8, 10)), 0, 0)));
                        const value = da.value / da.counter;
                        return {
                            ...da,
                            average: value,
                            formattedAverage: props.formatValue(value),
                            xaxis: DateTimeUtils.timestampToFormatedDate(utcDate, "H"),
                            datetime: DateTimeUtils.timestampToDate(utcDate, props.dateFormat) + ' ' + DateTimeUtils.timestampToFormatedDate(utcDate, "H:mm:ss"),
                        };
                    })} />

                <Chart
                    title="Daily"
                    subtitle={DateTimeUtils.timestampToShortDate(selectedTimestamp, props.shortDateFormat)}
                    readingUnitMeter={props.unitMeter}
                    readingType={props.title}
                    averages={props.airQualityDataAverages.monthlyAverages.map(da => {
                        const utcDate = DateTimeUtils.localeDateToTimestamp(new Date(Date.UTC(parseInt(da.timeRange.substring(0, 4)), parseInt(da.timeRange.substring(4, 6)) - 1, parseInt(da.timeRange.substring(6, 8)))));
                        const value = da.value / da.counter;
                        return {
                            ...da,
                            average: value,
                            formattedAverage: props.formatValue(value),
                            xaxis: DateTimeUtils.timestampToDate(utcDate, props.dateFormat),
                            datetime: DateTimeUtils.timestampToDate(utcDate, props.dateFormat),
                        };
                    })} />

                <Chart
                    title="Montly"
                    subtitle={DateTimeUtils.timestampToFormatedDate(selectedTimestamp, "YYYY")}
                    readingUnitMeter={props.unitMeter}
                    readingType={props.title}
                    averages={props.airQualityDataAverages.yearlyAverages.map(da => {
                        const utcDate = DateTimeUtils.localeDateToTimestamp(new Date(Date.UTC(parseInt(da.timeRange.substring(0, 4)), parseInt(da.timeRange.substring(4, 6)) - 1, 1)));
                        const value = da.value / da.counter;
                        return {
                            ...da,
                            average: value,
                            formattedAverage: props.formatValue(value),
                            xaxis: DateTimeUtils.timestampToShortDate(utcDate, props.shortDateFormat),
                            datetime: DateTimeUtils.timestampToShortDate(utcDate, props.shortDateFormat),
                        };
                    })} />
            </Paper>}
        </main>
    </div>;
};

export interface ChartsProps {
    title: string;
    unitMeter: string;
    formatValue: (value: number) => string;
    token: LoginToken;
    deviceId: string;
    airQualityDataAverages: AirQualityDataAverages;

    fetchAverages: (token: LoginToken, deviceId: string, measurementType: string, timestamp: number | undefined) => void;

    dateFormat: DateFormat;
    shortDateFormat: ShortDateFormat;
}