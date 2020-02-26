import Divider from "@material-ui/core/Divider/Divider";
import IconButton from "@material-ui/core/IconButton/IconButton";
import NativeSelect from "@material-ui/core/NativeSelect/NativeSelect";
import Paper from "@material-ui/core/Paper/Paper";
import Typography from "@material-ui/core/Typography/Typography";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import React, { FunctionComponent } from "react";
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();

    return <div className="app-settings">
        <AppBarOneRow>
            <IconButton edge="start" color="inherit" aria-label="menu" component={Link} to={Pages.DASHBOARD_URL} className="back-button">
                <ArrowBackIosIcon />
            </IconButton>
            <Typography variant="h6">
                {t("settings")}
            </Typography>
        </AppBarOneRow>
        <main>
            <Paper elevation={2} className="settings-container">
                <div className="settings">
                    <div className="labels">
                        <Typography variant="subtitle1">{t("temperatureUnit")}</Typography>
                        <Typography variant="subtitle2" className="secondary-label"></Typography>
                    </div>
                    <div className="configuration">
                        <NativeSelect value={props.temperatureUnit} onChange={(event) => props.onTemperatureUnitChange(event.target.value as string)}>
                            <option value={TemperatureUnit.CELSIUS}>{t("celsius")}</option>
                            <option value={TemperatureUnit.FAHRENHEIT}>{t("fahrenheit")}</option>
                        </NativeSelect>
                    </div>
                </div>

                <Divider />

                <div className="settings">
                    <div className="labels">
                        <Typography variant="subtitle1">{t("decimalSeparator")}</Typography>
                        <Typography variant="subtitle2" className="secondary-label"></Typography>
                    </div>
                    <div className="configuration">
                        <NativeSelect value={props.decimalSeparator} onChange={(event) => props.onDecimalSeparatorChange(event.target.value as string)}>
                            <option value=",">{t("coma")} (,)</option>
                            <option value=".">{t("dot")} (.)</option>
                        </NativeSelect>
                    </div>
                </div>

                <Divider />

                <div className="settings">
                    <div className="labels">
                        <Typography variant="subtitle1">{t("iconsLabels")}</Typography>
                        <Typography variant="subtitle2" className="secondary-label"></Typography>
                    </div>
                    <div className="configuration">
                        <NativeSelect value={props.iconVisualizationType} onChange={(event) => props.onIconVisualizationTypeChange(parseInt(event.target.value) as IconVisualizationType)}>
                            <option value={IconVisualizationType.icon}>{t("icons")}</option>
                            <option value={IconVisualizationType.label}>{t("labels")}</option>
                            <option value={IconVisualizationType.both}>{t("bothIconsLabels")}</option>
                        </NativeSelect>
                    </div>
                </div>

                <Divider />

                <div className="settings">
                    <div className="labels">
                        <Typography variant="subtitle1">{t("dateFormat")}</Typography>
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
                        <Typography variant="subtitle1">{t("shortDateFormat")}</Typography>
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