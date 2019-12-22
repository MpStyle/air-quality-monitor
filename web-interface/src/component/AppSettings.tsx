import { Divider } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar/AppBar";
import IconButton from "@material-ui/core/IconButton/IconButton";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Paper from "@material-ui/core/Paper/Paper";
import Select from "@material-ui/core/Select/Select";
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
                        <Select value={props.temperatureUnit} onChange={(event) => props.onTemperatureUnitChange(event.target.value as string)} displayEmpty>
                            <MenuItem value={TemperatureUnit.CELSIUS}>Celsius</MenuItem>
                            <MenuItem value={TemperatureUnit.FAHRENHEIT}>Fahrenheit</MenuItem>
                        </Select>
                    </div>
                </div>

                <Divider />
            </Paper>
        </main>
    </div>;
};

export interface AppSettingsProps {
    temperatureUnit: string;
    onTemperatureUnitChange: (temperatureUnit: string) => void;
}