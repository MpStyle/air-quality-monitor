import Divider from "@material-ui/core/Divider/Divider";
import IconButton from "@material-ui/core/IconButton/IconButton";
import NativeSelect from "@material-ui/core/NativeSelect/NativeSelect";
import Paper from "@material-ui/core/Paper/Paper";
import Typography from "@material-ui/core/Typography/Typography";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { IconVisualizationType } from "../../book/IconVisualizationType";
import { Pages } from "../../book/Pages";
import { TemperatureUnit } from "../../book/Unit";
import { DateFormat } from "../../entity/DateFormat";
import { ShortDateFormat } from "../../entity/ShortDateFormat";
import { AppBarOneRow } from "../common/AppBarOneRow";
import { DateTimeUtils } from './../../book/DateTimeUtils';
import "./AppSettings.scss";

export const AppSettings: FunctionComponent<AppSettingsProps> = (props) => {
    return <div className="app-settings">
        <AppBarOneRow>
            <IconButton edge="start" color="inherit" aria-label="menu" component={Link} to={Pages.DASHBOARD_URL} className="back-button">
                <ArrowBackIosIcon />
            </IconButton>
            <Typography variant="h6">
                App Settings
                </Typography>
        </AppBarOneRow>
        <main>
            <Paper elevation={2} className="settings-container">
                <div className="settings">
                    <div className="labels">
                        <Typography variant="subtitle1">Temperature unit</Typography>
                        <Typography variant="subtitle2" className="secondary-label"></Typography>
                    </div>
                    <div className="configuration">
                        <NativeSelect value={props.temperatureUnit} onChange={(event) => props.onTemperatureUnitChange(event.target.value as string)}>
                            <option value={TemperatureUnit.CELSIUS}>Celsius</option>
                            <option value={TemperatureUnit.FAHRENHEIT}>Fahrenheit</option>
                        </NativeSelect>
                    </div>
                </div>

                <Divider />

                <div className="settings">
                    <div className="labels">
                        <Typography variant="subtitle1">Decimal separator</Typography>
                        <Typography variant="subtitle2" className="secondary-label"></Typography>
                    </div>
                    <div className="configuration">
                        <NativeSelect value={props.decimalSeparator} onChange={(event) => props.onDecimalSeparatorChange(event.target.value as string)}>
                            <option value=",">Coma (,)</option>
                            <option value=".">Dot (.)</option>
                        </NativeSelect>
                    </div>
                </div>

                <Divider />

                <div className="settings">
                    <div className="labels">
                        <Typography variant="subtitle1">Icons - Labels</Typography>
                        <Typography variant="subtitle2" className="secondary-label"></Typography>
                    </div>
                    <div className="configuration">
                        <NativeSelect value={props.iconVisualizationType} onChange={(event) => props.onIconVisualizationTypeChange(parseInt(event.target.value) as IconVisualizationType)}>
                            <option value={IconVisualizationType.icon}>Icon</option>
                            <option value={IconVisualizationType.label}>Label</option>
                            <option value={IconVisualizationType.both}>Both</option>
                        </NativeSelect>
                    </div>
                </div>

                <Divider />

                <div className="settings">
                    <div className="labels">
                        <Typography variant="subtitle1">Date format</Typography>
                        <Typography variant="subtitle2" className="secondary-label"></Typography>
                    </div>
                    <div className="configuration">
                        <NativeSelect value={props.dateFormat} onChange={(event) => props.onDateFormatChange(parseInt(event.target.value) as DateFormat)}>
                            {Object.keys(DateFormat).reduce((acc, curr) => {
                                if (!isNaN(parseInt(curr))) {
                                    acc.push(<option value={parseInt(curr) as DateFormat} key={`date-format-${curr}`}>
                                        {DateTimeUtils.timestampToDate(Date.now(), parseInt(curr) as DateFormat)}
                                    </option>);
                                }
                                return acc;
                            }, [] as Array<JSX.Element>)}
                        </NativeSelect>
                    </div>
                </div>

                <Divider />

                <div className="settings">
                    <div className="labels">
                        <Typography variant="subtitle1">Short date format</Typography>
                        <Typography variant="subtitle2" className="secondary-label"></Typography>
                    </div>
                    <div className="configuration">
                        <NativeSelect value={props.shortDateFormat} onChange={(event) => props.onShortDateFormatChange(parseInt(event.target.value) as ShortDateFormat)}>
                            {Object.keys(ShortDateFormat).reduce((acc, curr) => {
                                if (!isNaN(parseInt(curr))) {
                                    acc.push(<option value={parseInt(curr) as ShortDateFormat} key={`date-format-${curr}`}>
                                        {DateTimeUtils.timestampToShortDate(Date.now(), parseInt(curr) as ShortDateFormat)}
                                    </option>);
                                }
                                return acc;
                            }, [] as Array<JSX.Element>)}
                        </NativeSelect>
                    </div>
                </div>
            </Paper>
        </main>
    </div>;
};

export interface AppSettingsProps {
    temperatureUnit: string;
    onTemperatureUnitChange: (temperatureUnit: string) => void;

    decimalSeparator: string;
    onDecimalSeparatorChange: (decimalSeparator: string) => void;

    dateFormat: DateFormat;
    onDateFormatChange: (dateFormat: DateFormat) => void;

    shortDateFormat: ShortDateFormat;
    onShortDateFormatChange: (dateFormat: ShortDateFormat) => void;

    iconVisualizationType: IconVisualizationType;
    onIconVisualizationTypeChange: (value: IconVisualizationType) => void;
}