import Box from '@material-ui/core/Box/Box';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Menu from '@material-ui/core/Menu/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import MenuIcon from '@material-ui/icons/Menu';
import React, { FunctionComponent } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { airQualityToLabel } from "../../book/AirQualityToLabel";
import { Device } from '../../entity/Device';
import './DashboardHeader.scss';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';

export const DashboardHeader: FunctionComponent<DashboardHeaderProps> = (props) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return <Box boxShadow={2} className="dashboard-header">
        <IconButton onClick={props.toggleDrawer(true)} className="hamburger">
            <MenuIcon />
        </IconButton>
        <div className="sub-headers">
            {props.currentDevice &&
                <div className="sub-header device-list">
                    <div aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                        {props.currentDevice ? props.currentDevice.name : "Select a device..."}
                        <ArrowDropDownIcon />
                    </div>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}>
                        {props.devices.map((device) => (
                            <MenuItem key={device.deviceId} value={device.deviceId} onClick={() => {
                                props.onCurrentDeviceChange(device);
                                handleClose();
                            }}>
                                {device.name}
                            </MenuItem>
                        ))}
                    </Menu>
                </div>}
            <div className="sub-header quality">
                {airQualityToLabel(props.average)}
            </div>
            <div className="sub-header carousel">
                {props.suggestions && props.suggestions.length > 0 && <AliceCarousel
                    autoPlayInterval={6000}
                    buttonsDisabled={true}
                    dotsDisabled={props.suggestions.length === 1}
                    autoPlay={props.suggestions.length > 1}>
                    {props.suggestions.map((s, i) => <div key={`slide-${i}`}>{s}</div>)}
                </AliceCarousel >}
            </div>
        </div>
        {props.isLoading && <CircularProgress size={22} className="spinner" />}
    </Box>;
};

export interface DashboardHeaderProps {
    suggestions: string[];
    average: number;
    devices: Device[];
    currentDevice: Device | null;
    onCurrentDeviceChange: (device: Device) => void;
    toggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
    isLoading: boolean;
}