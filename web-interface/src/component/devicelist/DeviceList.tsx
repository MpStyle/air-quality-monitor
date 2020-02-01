import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import IconButton from "@material-ui/core/IconButton/IconButton";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Paper from "@material-ui/core/Paper/Paper";
import Typography from "@material-ui/core/Typography/Typography";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { DASHBOARD_URL } from "../../book/Pages";
import { Device } from "../../entity/Device";
import { LoginToken } from "../../entity/LoginToken";
import { AppBarOneRow } from "../common/AppBarOneRow";
import "./DeviceList.scss";

export const DeviceList: FunctionComponent<DevicesListProps> = (props) => {
    return <div className="devices-list">
        <AppBarOneRow>
            <IconButton edge="start" color="inherit" aria-label="menu" component={Link} to={DASHBOARD_URL} className="back-button">
                <ArrowBackIosIcon />
            </IconButton>
            <Typography variant="h6">
                Devices List
            </Typography>
        </AppBarOneRow>
        <main>
            {props.isLoading && <Paper elevation={2} className="loading">
                <div className="message">Loading...</div>
                <CircularProgress />
            </Paper>}
            {!props.isLoading && <Paper elevation={2} className="devices-list-container">
                {!props.devices.length && <div className="message">No devices</div>}

                {props.devices && <List>
                    {props.devices.map(d => <ListItem key={d.deviceId}>
                        <ListItemIcon onClick={() => props.onDeleteClick(props.token, d.deviceId)}>
                            <IconButton>
                                <DeleteForeverIcon />
                            </IconButton>
                        </ListItemIcon>
                        <ListItemText primary={d.name} />
                    </ListItem>)}
                </List>}
            </Paper>}
        </main>
    </div>;
};

export interface DevicesListProps {
    devices: Device[];
    token: LoginToken;
    onDeleteClick: (token: LoginToken, deviceId: string) => void;
    isLoading: boolean;
}