import Button from "@material-ui/core/Button/Button";
import Fade from '@material-ui/core/Fade';
import IconButton from "@material-ui/core/IconButton/IconButton";
import List from "@material-ui/core/List/List";
import Modal from "@material-ui/core/Modal/Modal";
import Paper from "@material-ui/core/Paper/Paper";
import Typography from "@material-ui/core/Typography/Typography";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import InfoIcon from '@material-ui/icons/Info';
import React, { useEffect, useState, FunctionComponent } from "react";
import { useTranslation } from 'react-i18next';
import { useHistory, Redirect } from "react-router-dom";
import { Pages } from "../../book/Pages";
import { Device } from "../../entity/Device";
import { LoginToken } from "../../entity/LoginToken";
import { MeterUnit } from "../../entity/MeterUnit";
import { AppBarOneRow } from "../common/AppBarOneRow";
import { LoadingPaper } from "../common/LoadingPaper";
import { DeviceInfo } from "./DeviceInfo";
import "./DeviceList.scss";

export const DeviceList: FunctionComponent<DevicesListProps> = (props) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const onDeleteClick = (d: Device) => {
        setDeviceToDelete(d);
        setOpenModal(true);
    };
    const { fetchDevices, token } = props;

    useEffect(() => {
        if (token) {
            fetchDevices(token);
        }
    }, [fetchDevices, token]);

    if (!token) {
        return <Redirect to={Pages.LOGIN_URL} />;
    }

    return <div className="devices-list">
        <AppBarOneRow>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => history.goBack()} className="back-button">
                <ArrowBackIosIcon />
            </IconButton>
            <Typography variant="h6">
                {t("deviceList")}
            </Typography>
        </AppBarOneRow>
        <main>
            {props.isLoading && <LoadingPaper message={`${t("loading")}...`} />}
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