import Divider from "@material-ui/core/Divider/Divider";
import Drawer from "@material-ui/core/Drawer/Drawer";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Typography from "@material-ui/core/Typography/Typography";
import DashboardIcon from '@material-ui/icons/Dashboard';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import InfoIcon from '@material-ui/icons/Info';
import PersonIcon from '@material-ui/icons/Person';
import PhonelinkRingIcon from '@material-ui/icons/PhonelinkRing';
import SettingsIcon from '@material-ui/icons/Settings';
import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { airQualityToLabel } from "../../book/AirQualityToLabel";
import { APP_CONSOLE_URL, APP_SETTINGS_URL, CREDITS_URL, DEVICE_LIST_URL } from '../../book/Pages';
import { Device } from "../../entity/Device";
import logo from '../../images/logo.svg';
import "./AppDrawer.scss";

export const AppDrawer: FunctionComponent<AppDrawerProps> = (props) => {
    return <Drawer open={props.isOpen} onClose={props.toggleDrawer(false)} className="app-drawer">
        <div
            role="presentation"
            onClick={props.toggleDrawer(false)}
            onKeyDown={props.toggleDrawer(false)}
            className="list-container">

            <div className="app">
                <Typography variant="h6">
                    <div className="logo-container">
                        <img src={logo} alt="Air Quality Monitor" />
                    </div>
                    Air Quality Monitor
                </Typography>
            </div>

            <Divider />

            <div className="user">
                <Typography variant="h6">
                    <PersonIcon className="icon" />
                    {props.username}
                </Typography>
            </div>

            <Divider />

            {props.currentDevice && <div className="device">
                <Typography variant="h6">
                    <PhonelinkRingIcon className="icon" />
                    {props.currentDevice.name} <span className="air-quality-average">({airQualityToLabel(props.average)})</span>
                </Typography>
                <div className="ip">
                    <strong>IP:</strong> {props.currentDevice.deviceIP.split(";")[0]}
                </div>
                {props.currentDevice.address && props.currentDevice.address.length && <div className="address">{props.currentDevice.address}</div>}
            </div>}

            <Divider />

            <List>
                <ListItem button className="list-item" component={Link} to={DEVICE_LIST_URL}>
                    <ListItemIcon>
                        <FormatListBulletedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Device List" />
                </ListItem>
                <ListItem button className="list-item" component={Link} to={APP_SETTINGS_URL}>
                    <ListItemIcon>
                        <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                </ListItem>
                <ListItem button className="list-item" component={Link} to={CREDITS_URL}>
                    <ListItemIcon>
                        <InfoIcon />
                    </ListItemIcon>
                    <ListItemText primary="Credits" />
                </ListItem>
                <ListItem button className="list-item" component={Link} to={APP_CONSOLE_URL}>
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Console" />
                </ListItem>
                <ListItem button className="list-item" onClick={() => props.onLogoutClick()}>
                    <ListItemIcon>
                        <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </div>
    </Drawer>;
};

export interface AppDrawerProps {
    isOpen: boolean;
    average: number;
    toggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
    currentDevice: Device | null;
    onLogoutClick: () => void;
    username: string;
}