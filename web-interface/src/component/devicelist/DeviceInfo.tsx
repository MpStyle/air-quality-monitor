import IconButton from "@material-ui/core/IconButton/IconButton";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { useState, FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { Device } from "../../entity/Device";
import { MeterUnit } from "../../entity/MeterUnit";

export const DeviceInfo: FunctionComponent<DeviceInfoProps> = props => {
    const { t } = useTranslation();
    const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
    const isThereAddress = props.device.address && props.device.address.length;
    const isThereIp = props.device.deviceIP && props.device.deviceIP.length;

    return <ListItem className="device">
        {(isThereIp || isThereAddress) && <ListItemIcon
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}>
            <IconButton>
                {isDetailsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
        </ListItemIcon>}
        <ListItemText
            primary={props.device.name}
            secondary={
                isDetailsOpen && <React.Fragment>
                    {isThereIp && <div className="ip">
                        <strong>{t("ip")}:</strong> {props.device.deviceIP.split(";")[0]}
                    </div>}
                    {isThereAddress && <div className="address">
                        <strong>{t("address")}:</strong> {props.device.address}
                    </div>}
                </React.Fragment>
            } />
        <ListItemIcon>
            <IconButton onClick={() => props.onDeleteClick(props.device)}>
                <DeleteForeverIcon />
            </IconButton>
        </ListItemIcon>
    </ListItem>;
};

export interface DeviceInfoProps {
    device: Device;
    meterUnit: MeterUnit;
    decimalSeparator: string;
    onDeleteClick: (device: Device) => void;
}