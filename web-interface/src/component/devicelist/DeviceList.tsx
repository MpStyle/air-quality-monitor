import Button from "@material-ui/core/Button/Button";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Fade from '@material-ui/core/Fade';
import IconButton from "@material-ui/core/IconButton/IconButton";
import List from "@material-ui/core/List/List";
import Modal from "@material-ui/core/Modal/Modal";
import Paper from "@material-ui/core/Paper/Paper";
import Typography from "@material-ui/core/Typography/Typography";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import InfoIcon from '@material-ui/icons/Info';
import React, { useEffect, useState, FunctionComponent } from "react";
import { useHistory } from "react-router-dom";
import { Device } from "../../entity/Device";
import { LoginToken } from "../../entity/LoginToken";
import { MeterUnit } from "../../entity/MeterUnit";
import { AppBarOneRow } from "../common/AppBarOneRow";
import { DeviceInfo } from "./DeviceInfo";
import "./DeviceList.scss";
import { LoadingPaper } from "../common/LoadingPaper";

export const DeviceList: FunctionComponent<DevicesListProps> = (props) => {
    const history = useHistory();
    const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const onDeleteClick = (d: Device) => {
        setDeviceToDelete(d);
        setOpenModal(true);
    };
    const { fetchDevices, token } = props;

    useEffect(() => {
        fetchDevices(token);
    }, [fetchDevices, token]);

    return <div className="devices-list">
        <AppBarOneRow>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => history.goBack()} className="back-button">
                <ArrowBackIosIcon />
            </IconButton>
            <Typography variant="h6">
                Devices List
            </Typography>
        </AppBarOneRow>
        <main>
            {props.isLoading && <LoadingPaper message="Loading..." />}
            {!props.isLoading && <Paper elevation={2} className="devices-list-container">
                {!props.devices.length && <div className="message">No devices</div>}

                {props.devices && <List className="devices-list">
                    {props.devices.map(d => <DeviceInfo key={`device-${d.deviceId}`} device={d} decimalSeparator={props.decimalSeparator} meterUnit={props.meterUnit} onDeleteClick={onDeleteClick} />)}
                </List>}
            </Paper>}
        </main>
        <Modal
            className="delete-request-modal"
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={openModal}
            onClose={() => { setOpenModal(false); }}>
            <Fade in={openModal}>
                <Paper elevation={2} className="delete-request">
                    <InfoIcon /> Are you sure to delete {deviceToDelete?.name}?
                    <div className="buttons">
                        <Button onClick={() => {
                            props.onDeleteClick(props.token, (deviceToDelete as Device).deviceId);
                            setOpenModal(false);
                        }}>Yes</Button>
                        <Button onClick={() => setOpenModal(false)}>No</Button>
                    </div>
                </Paper>
            </Fade>
        </Modal>
    </div>;
};

export interface DevicesListProps {
    devices: Device[];
    token: LoginToken;
    decimalSeparator: string;
    meterUnit: MeterUnit;
    onDeleteClick: (token: LoginToken, deviceId: string) => void;
    fetchDevices: (token: LoginToken) => void;
    isLoading: boolean;
}