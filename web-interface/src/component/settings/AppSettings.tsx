import Divider from "@material-ui/core/Divider/Divider";
import IconButton from "@material-ui/core/IconButton/IconButton";
import NativeSelect from "@material-ui/core/NativeSelect/NativeSelect";
import Paper from "@material-ui/core/Paper/Paper";
import Typography from "@material-ui/core/Typography/Typography";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import React, { FunctionComponent } from "react";
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import { IconVisualizationType } from "../../book/IconVisualizationType";
import { TemperatureUnit } from "../../book/Unit";
import { DateFormat } from "../../entity/DateFormat";
import { ShortDateFormat } from "../../entity/ShortDateFormat";
import { AppBarOneRow } from "../common/AppBarOneRow";
import { DateTimeUtils } from './../../book/DateTimeUtils';
import "./AppSettings.scss";
import { AppSettingsItem } from "./AppSettingsItem";

export const AppSettings: FunctionComponent<AppSettingsProps> = (props) => {
    const history = useHistory();
    const { t } = useTranslation();

    return <div className="app-settings">
        <AppBarOneRow>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => history.goBack()} className="back-button">
                <ArrowBackIosIcon />
            </IconButton>
            <Typography variant="h6">
                {t("settings")}
            </Typography>
        </AppBarOneRow>
        <main>
            <Paper elevation={2} className="settings-container">
                <AppSettingsItem title={t("language")}>
                    <NativeSelect value={props.language} onChange={(event) => props.onLanguageChange(event.target.value)}>
                        <option value="en">English</option>
                        <option value="it">Italiano</option>
                    </NativeSelect>
                </AppSettingsItem>

                <Divider />

                <AppSettingsItem title={t("temperatureUnit")}>
                    <NativeSelect value={props.temperatureUnit} onChange={(event) => props.onTemperatureUnitChange(event.target.value as string)}>
                        <option value={TemperatureUnit.CELSIUS}>{t("celsius")}</option>
                        <option value={TemperatureUnit.FAHRENHEIT}>{t("fahrenheit")}</option>
                    </NativeSelect>
                </AppSettingsItem>

                <Divider />

                <AppSettingsItem title={t("decimalSeparator")}>
                    <NativeSelect value={props.decimalSeparator} onChange={(event) => props.onDecimalSeparatorChange(event.target.value as string)}>
                        <option value=",">{t("coma")} (,)</option>
                        <option value=".">{t("dot")} (.)</option>
                    </NativeSelect>
                </AppSettingsItem>

                <Divider />

                <AppSettingsItem title={t("iconsLabels")}>
                    <NativeSelect value={props.iconVisualizationType} onChange={(event) => props.onIconVisualizationTypeChange(parseInt(event.target.value) as IconVisualizationType)}>
                        <option value={IconVisualizationType.icon}>{t("icons")}</option>
                        <option value={IconVisualizationType.label}>{t("labels")}</option>
                        <option value={IconVisualizationType.both}>{t("bothIconsLabels")}</option>
                    </NativeSelect>
                </AppSettingsItem>

                <Divider />

                <AppSettingsItem title={t("dateFormat")}>
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
                </AppSettingsItem>

                <Divider />

                <AppSettingsItem title={t("shortDateFormat")}>
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
                </AppSettingsItem>
            </Paper>
        </main>
    </div>;
};

export interface AppSettingsProps {
    language: string;
    onLanguageChange: (language: string) => void;

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