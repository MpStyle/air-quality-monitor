import IconButton from "@material-ui/core/IconButton/IconButton";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { Device } from "../../entity/Device";
import { MeterUnit } from "../../entity/MeterUnit";
import "./DeviceInfo.scss";

export const DeviceInfo: FunctionComponent<DeviceInfoProps> = props => {
    const { t } = useTranslation();
    const isThereAddress = props.device.address && props.device.address.length;
    const isThereIp = !!props.device.ip && !!props.device.ip.length;
    const isThereSSID = !!props.device.wifiName && !!props.device.wifiName.length;
    const isThereSignalStrenght = !!props.device.wifiSignalStrength;

    return <ListItem className="device">
        {(isThereIp || isThereAddress) && <ListItemIcon
            onClick={() => props.onCurrentDeviceChange(props.device)}>
            <IconButton>
                {props.isCurrentDevice ?
                    <RadioButtonCheckedIcon /> :
                    <RadioButtonUncheckedIcon />}
            </IconButton>
        </ListItemIcon>}
        <ListItemText
            primary={<div className="device-name">{props.device.name}</div>}
            secondary={
                <React.Fragment>
                    {isThereIp && <div className="ip">
                        <strong>{t("ip")}:</strong> {props.device.ip}
                    </div>}
                    {isThereSSID && <div className="ssid">
                        <strong>{t("ssid")}:</strong> {props.device.wifiName}
                    </div>}
                    {isThereSignalStrenght && <div className="wifi-strenght">
                        <strong>{t("wifi-strenght")}:</strong>&nbsp;{100 * (1 - (-40 - props.device.wifiSignalStrength) / (-40 - 40))}%
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
    onCurrentDeviceChange: (device: Device) => void;
    isCurrentDevice: boolean;
}