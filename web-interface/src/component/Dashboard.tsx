import Box from '@material-ui/core/Box/Box';
import Divider from '@material-ui/core/Divider/Divider';
import Drawer from '@material-ui/core/Drawer/Drawer';
import IconButton from '@material-ui/core/IconButton/IconButton';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import Menu from '@material-ui/core/Menu/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useEffect, FunctionComponent } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { airQualityToLabel } from "../book/AirQualityToLabel";
import { averageAirStatus } from "../book/AverageAirStatus";
import { epochToFormatedDate } from '../book/DateTimeUtils';
import { AirQualityData } from '../entity/AirQualityData';
import { AirStatus } from "../entity/AirStatus";
import { Device } from "../entity/Device";
import { MeterUnit } from '../entity/MeterUnit';
import co2 from '../images/co2.svg';
import humidity from '../images/humidity.svg';
import noise from '../images/noise.svg';
import pressure from '../images/pressure.svg';
import temperature from '../images/temperature.svg';
import tvoc from '../images/tvoc.svg';
import './Dashboard.scss';
import { DataRow } from './DataRow';

export const Dashboard: FunctionComponent<HomeProps> = (props) => {
    useEffect(() => { props.fetchDevices(); }, []);
    useEffect(() => {
        if (props.currentDeviceId)
            props.fetchAirQualityData(props.currentDeviceId as string);
    }, [props.currentDeviceId]);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const average = averageAirStatus(props.airStatus);
    const areThereDevices = !!(props.devices && props.devices.length);
    const currentDevice = props.devices.find(d => d.id === props.currentDeviceId);

    const [isAppDrawerOpen, setIsAppDrawerOpen] = React.useState(false);

    const toggleDrawer = (open: boolean) => (
        event: React.KeyboardEvent | React.MouseEvent
    ) => {
        if (
            event.type === "keydown" &&
            ((event as React.KeyboardEvent).key === "Tab" ||
                (event as React.KeyboardEvent).key === "Shift")
        ) {
            return;
        }

        setIsAppDrawerOpen(open);
    };

    return <div className="dashboard">
        <Drawer open={isAppDrawerOpen} onClose={toggleDrawer(false)}>
            <div
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
            >
                <List>
                    <ListItem button>
                        <ListItemText primary="ciao" />
                    </ListItem>
                </List>
            </div>
        </Drawer>

        <Box boxShadow={2} className="header">
            <IconButton onClick={toggleDrawer(true)} className="hamburger">
                <MenuIcon />
            </IconButton>
            <div className="sub-headers">
                {areThereDevices &&
                    <div className="sub-header device-list">
                        <div aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                            {currentDevice ? currentDevice.name : "Select a device..."}
                        </div>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            {props.devices.map((device) => (
                                <MenuItem key={device.id} value={device.id} onClick={() => {
                                    props.onCurrentDeviceIdChange(device.id);
                                    handleClose();
                                }}>{device.name}</MenuItem>
                            ))}
                        </Menu>
                    </div>}
                <div className="sub-header quality">
                    {airQualityToLabel(average)}
                </div>
                <div className="sub-header carousel">
                    {props.suggestions && props.suggestions.length > 0 && <AliceCarousel autoPlayInterval={6000} buttonsDisabled={true} autoPlay={true}>
                        {props.suggestions.map((s, i) => <div key={`slide-${i}`}>{s}</div>)}
                    </AliceCarousel >}
                </div>
            </div>
        </Box>
        <Paper className="air-quality-data">
            <DataRow
                title="Temperature"
                icon={temperature}
                value={props.airQualityData.temperature}
                meter={props.meterUnit.temperature}
                quality={props.airStatus.temperature} />

            <Divider light />

            <DataRow
                title="Humidity"
                icon={humidity}
                value={props.airQualityData.humidity}
                meter={props.meterUnit.humidity}
                quality={props.airStatus.humidity} />

            <Divider light />

            <DataRow
                title="CO2"
                icon={co2}
                value={props.airQualityData.co2}
                meter={props.meterUnit.co2}
                quality={props.airStatus.co2} />

            <Divider light />

            <DataRow
                title="Noise"
                icon={noise}
                value={props.airQualityData.noise}
                meter={props.meterUnit.noise}
                quality={props.airStatus.noise} />

            <Divider light />

            <DataRow
                title="Pressure"
                icon={pressure}
                value={props.airQualityData.pressure}
                meter={props.meterUnit.pressure}
                quality={props.airStatus.pressure} />

            <Divider light />

            <DataRow
                title="TVOC"
                icon={tvoc}
                value={props.airQualityData.tvoc}
                meter={props.meterUnit.tvoc}
                quality={props.airStatus.tvoc} />

            <Divider light />

            <div>{props.airQualityData.inserted && <div className="last-update"><span>Last update:</span> {epochToFormatedDate(props.airQualityData.inserted)}</div>}</div>

        </Paper>
    </div>;
};

export interface HomeProps {
    airQualityData: AirQualityData;
    airStatus: AirStatus;
    meterUnit: MeterUnit;

    devices: Device[];
    suggestions: string[];

    currentDeviceId: string | null;
    onCurrentDeviceIdChange: (deviceId: string) => void;

    fetchDevices: () => void;
    fetchAirQualityData: (currentDeviceId: string) => void;
}