import AppBar from "@material-ui/core/AppBar/AppBar";
import Divider from "@material-ui/core/Divider/Divider";
import IconButton from "@material-ui/core/IconButton/IconButton";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import NativeSelect from "@material-ui/core/NativeSelect/NativeSelect";
import Paper from "@material-ui/core/Paper/Paper";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { DASHBOARD_URL } from "../book/Pages";
import { TemperatureUnit } from "../book/Unit";
import "./AppSettings.scss";

export const AppSettings: FunctionComponent<AppSettingsProps> = (props) => {
    return <div className="app-settings">
        <AppBar position="static" className="app-bar">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" component={Link} to={DASHBOARD_URL} className="back-button">
                    <ArrowBackIosIcon />
                </IconButton>
                <Typography variant="h6">
                    App Settings
                </Typography>
            </Toolbar>
        </AppBar>
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
            </Paper>
        </main>
    </div>;
};

export interface AppSettingsProps {
    temperatureUnit: string;
    onTemperatureUnitChange: (temperatureUnit: string) => void;

    decimalSeparator: string;
    onDecimalSeparatorChange: (decimalSeparator: string) => void;
}