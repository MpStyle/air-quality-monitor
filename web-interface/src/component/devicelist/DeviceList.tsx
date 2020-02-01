import { Button } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Fade from '@material-ui/core/Fade';
import IconButton from "@material-ui/core/IconButton/IconButton";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Modal from "@material-ui/core/Modal/Modal";
import Paper from "@material-ui/core/Paper/Paper";
import Typography from "@material-ui/core/Typography/Typography";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import InfoIcon from '@material-ui/icons/Info';
import React, { FunctionComponent, useState } from "react";
import { Link } from "react-router-dom";
import { DASHBOARD_URL } from "../../book/Pages";
import { Device } from "../../entity/Device";
import { LoginToken } from "../../entity/LoginToken";
import { AppBarOneRow } from "../common/AppBarOneRow";
import "./DeviceList.scss";

export const DeviceList: FunctionComponent<DevicesListProps> = (props) => {
    const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);
    const [open, setOpen] = useState(false);

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
                        <ListItemIcon onClick={() => {
                            setDeviceToDelete(d);
                            setOpen(true);
                        }}>
                            <IconButton>
                                <DeleteForeverIcon />
                            </IconButton>
                        </ListItemIcon>
                        <ListItemText primary={d.name} />
                    </ListItem>)}
                </List>}
            </Paper>}
        </main>
        <Modal
            className="delete-request-modal"
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClose={() => { setOpen(false); }}>
            <Fade in={open}>
                <Paper elevation={2} className="delete-request">
                    <InfoIcon /> Are you sure to delete {deviceToDelete?.name}?
                    <div className="buttons">
                        <Button onClick={() => {
                            props.onDeleteClick(props.token, (deviceToDelete as Device).deviceId);
                            setOpen(false);
                        }}>Yes</Button>
                        <Button onClick={() => setOpen(false)}>No</Button>
                    </div>
                </Paper>
            </Fade>
        </Modal>
    </div>;
};

export interface DevicesListProps {
    devices: Device[];
    token: LoginToken;
    onDeleteClick: (token: LoginToken, deviceId: string) => void;
    isLoading: boolean;
}