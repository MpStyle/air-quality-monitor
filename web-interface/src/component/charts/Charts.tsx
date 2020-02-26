import MomentUtils from '@date-io/moment';
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Paper from "@material-ui/core/Paper/Paper";
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from "@material-ui/core/Typography/Typography";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import InsertInvitationIcon from '@material-ui/icons/InsertInvitation';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import * as React from 'react';
import { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link, useParams } from "react-router-dom";
import { DateTimeUtils } from '../../book/DateTimeUtils';
import { Pages } from "../../book/Pages";
import { StringUtils } from "../../book/StringUtils";
import { AirQualityDataAverages } from "../../entity/AirQualityDataAverages";
import { DateFormat } from '../../entity/DateFormat';
import { LoadingState } from "../../entity/LoadingState";
import { ShortDateFormat } from '../../entity/ShortDateFormat';
import { AppBarOneRow } from "../common/AppBarOneRow";
import { LoginToken } from './../../entity/LoginToken';
import { Chart } from "./Chart";
import "./Charts.scss";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        grow: {
            flexGrow: 1,
        },
    }));

export const Charts: FunctionComponent<ChartsProps> = (props) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { readingType } = useParams();
    const [selectedTimestamp, setSelectedTimestamp] = useState<number>(Date.now());
    const [isCalendarVisible, setIsCalendarVisible] = useState<boolean>(false);

    useEffect(() => {
        props.fetchAverages(props.token, props.deviceId, readingType as string, Date.now());
    }, []);

    return <div className="charts">
        <AppBarOneRow>
            <IconButton edge="start" color="inherit" aria-label="back to dashboard" component={Link} to={Pages.DASHBOARD_URL} className="back-button">
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
                                props.fetchAverages(props.token, props.deviceId, readingType as string, choosedDate);
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
                        const utcDate = new Date(Date.UTC(parseInt(da.timeRange.substring(0, 4)), parseInt(da.timeRange.substring(4, 6)), parseInt(da.timeRange.substring(6, 8)), parseInt(da.timeRange.substring(8, 10)), 0, 0));
                        return {
                            ...da,
                            average: parseFloat((da.value / da.counter).toFixed(1)),
                            count: da.value,
                            xaxis: utcDate.getHours().toString(),
                            datetime: `${utcDate.getFullYear()}-${StringUtils.padLeft(utcDate.getMonth() + 1, '0', 2)}-${StringUtils.padLeft(utcDate.getDate(), '0', 2)} ${utcDate.getHours()}:00`,
                            granularity: da.granularity
                        };
                    })} />

                <Chart
                    title="Daily"
                    subtitle={DateTimeUtils.timestampToShortDate(selectedTimestamp, props.shortDateFormat)}
                    readingUnitMeter={props.unitMeter(readingType as string)}
                    readingType={props.title(readingType as string)}
                    averages={props.airQualityDataAverages.monthlyAverages.map(da => ({
                        ...da,
                        average: parseFloat((da.value / da.counter).toFixed(1)),
                        count: da.value,
                        xaxis: da.timeRange.substring(4, 6) + '-' + da.timeRange.substring(6),
                        datetime: da.timeRange.substring(0, 4) + '-' + da.timeRange.substring(4, 6) + '-' + da.timeRange.substring(6),
                        granularity: da.granularity
                    }))} />

                <Chart
                    title="Montly"
                    subtitle={DateTimeUtils.timestampToFormatedDate(selectedTimestamp, "YYYY")}
                    readingUnitMeter={props.unitMeter(readingType as string)}
                    readingType={props.title(readingType as string)}
                    averages={props.airQualityDataAverages.yearlyAverages.map(da => ({
                        ...da,
                        average: parseFloat((da.value / da.counter).toFixed(1)),
                        counter: da.counter,
                        xaxis: da.timeRange.substring(0, 4) + '-' + da.timeRange.substring(4),
                        datetime: da.timeRange.substring(0, 4) + '-' + da.timeRange.substring(4),
                        granularity: da.granularity
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

    fetchAverages: (token: LoginToken, deviceId: string, measurementType: string, timestamp: number | undefined) => void;

    dateFormat: DateFormat;
    shortDateFormat: ShortDateFormat;
}