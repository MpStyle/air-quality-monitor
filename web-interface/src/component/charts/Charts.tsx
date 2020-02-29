import MomentUtils from '@date-io/moment';
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Paper from "@material-ui/core/Paper/Paper";
import Typography from "@material-ui/core/Typography/Typography";
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import InsertInvitationIcon from '@material-ui/icons/InsertInvitation';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import React, { useEffect, useState, FunctionComponent } from "react";
import { useHistory, useParams } from "react-router-dom";
import { DateTimeUtils } from '../../book/DateTimeUtils';
import { AirQualityDataAverages } from "../../entity/AirQualityDataAverages";
import { DateFormat } from '../../entity/DateFormat';
import { LoadingState } from "../../entity/LoadingState";
import { ShortDateFormat } from '../../entity/ShortDateFormat';
import { AppBarOneRow } from "../common/AppBarOneRow";
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
    const classes = useStyles();
    const { readingType, deviceId } = useParams();
    const history = useHistory();
    const [selectedTimestamp, setSelectedTimestamp] = useState<number>(Date.now());
    const [isCalendarVisible, setIsCalendarVisible] = useState<boolean>(false);

    useEffect(() => {
        props.fetchAverages(props.token, deviceId ?? props.deviceId, readingType as string, Date.now());
    }, []);

    return <div className="charts">
        <AppBarOneRow>
            <IconButton edge="start" color="inherit" aria-label="go back" onClick={() => history.goBack()} className="back-button">
                <ArrowBackIosIcon />
            </IconButton>
            <Typography variant="h6">
                {props.title(readingType as string)} ({props.unitMeter(readingType as string)})
            </Typography>
            <div className={classes.grow} />
            <IconButton edge="start" color="inherit" aria-label="select date" className="select-date-button" onClick={() => setIsCalendarVisible(!isCalendarVisible)}>
                <InsertInvitationIcon />
            </IconButton>
        </AppBarOneRow>
        <main>
            {props.airQualityDataAverages.loadingState === LoadingState.loading && <Paper elevation={2} className="loading">
                <div className="message">Loading...</div>
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
                                props.fetchAverages(props.token, deviceId ?? props.deviceId, readingType as string, choosedDate);
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </div>

                <Chart
                    title="Hourly"
                    subtitle={DateTimeUtils.timestampToDate(selectedTimestamp, props.dateFormat)}
                    readingUnitMeter={props.unitMeter(readingType as string)}
                    readingType={props.title(readingType as string)}
                    averages={props.airQualityDataAverages.dailyAverages.map(da => {
                        const utcDate = DateTimeUtils.localeDateToTimestamp(new Date(Date.UTC(parseInt(da.timeRange.substring(0, 4)), parseInt(da.timeRange.substring(4, 6)), parseInt(da.timeRange.substring(6, 8)), parseInt(da.timeRange.substring(8, 10)), 0, 0)));
                        const value = da.value / da.counter;
                        return {
                            ...da,
                            average: value,
                            formattedAverage: props.value(readingType as string, value, props.decimalSeparator),
                            count: da.value,
                            xaxis: DateTimeUtils.timestampToFormatedDate(utcDate, "H"),
                            datetime: DateTimeUtils.timestampToDate(utcDate, props.dateFormat) + ' ' + DateTimeUtils.timestampToFormatedDate(utcDate, "H:mm:ss"),
                            granularity: da.granularity
                        };
                    })} />

                <Chart
                    title="Daily"
                    subtitle={DateTimeUtils.timestampToShortDate(selectedTimestamp, props.shortDateFormat)}
                    readingUnitMeter={props.unitMeter(readingType as string)}
                    readingType={props.title(readingType as string)}
                    averages={props.airQualityDataAverages.monthlyAverages.map(da => {
                        const utcDate = DateTimeUtils.localeDateToTimestamp(new Date(Date.UTC(parseInt(da.timeRange.substring(0, 4)), parseInt(da.timeRange.substring(4, 6)), parseInt(da.timeRange.substring(6, 8)))));
                        const value = da.value / da.counter;
                        return {
                            ...da,
                            average: value,
                            formattedAverage: props.value(readingType as string, value, props.decimalSeparator),
                            count: da.value,
                            xaxis: DateTimeUtils.timestampToDate(utcDate, props.dateFormat),
                            datetime: DateTimeUtils.timestampToDate(utcDate, props.dateFormat),
                            granularity: da.granularity
                        };
                    })} />

                <Chart
                    title="Montly"
                    subtitle={DateTimeUtils.timestampToFormatedDate(selectedTimestamp, "YYYY")}
                    readingUnitMeter={props.unitMeter(readingType as string)}
                    readingType={props.title(readingType as string)}
                    averages={props.airQualityDataAverages.yearlyAverages.map(da => {
                        const utcDate = DateTimeUtils.localeDateToTimestamp(new Date(Date.UTC(parseInt(da.timeRange.substring(0, 4)), parseInt(da.timeRange.substring(4, 6)), 1)));
                        const value = da.value / da.counter;
                        return {
                            ...da,
                            average: value,
                            formattedAverage: props.value(readingType as string, value, props.decimalSeparator),
                            counter: da.counter,
                            xaxis: DateTimeUtils.timestampToShortDate(utcDate, props.shortDateFormat),
                            datetime: DateTimeUtils.timestampToShortDate(utcDate, props.shortDateFormat),
                            granularity: da.granularity
                        };
                    })} />
            </Paper>}
        </main>
    </div>;
};

export interface ChartsProps {
    title: (measurementType: string) => string;
    unitMeter: (measurementType: string) => string;
    value: (measurementType: string, value: number, decimalSeparator: string) => string;
    token: LoginToken;
    deviceId: string;
    decimalSeparator: string;
    airQualityDataAverages: AirQualityDataAverages;

    fetchAverages: (token: LoginToken, deviceId: string, measurementType: string, timestamp: number | undefined) => void;

    dateFormat: DateFormat;
    shortDateFormat: ShortDateFormat;
}