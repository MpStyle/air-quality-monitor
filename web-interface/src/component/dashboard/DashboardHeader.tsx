import Box from '@material-ui/core/Box/Box';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import IconButton from '@material-ui/core/IconButton/IconButton';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { AirQualityData } from '../../entity/AirQualityData';
import { DateFormat } from '../../entity/DateFormat';
import { Device } from '../../entity/Device';
import { AirQualityToLabel } from '../common/AirQualityToLabel';
import './DashboardHeader.scss';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import { Pages } from '../../book/Pages';
import { Link } from 'react-router-dom';

export const DashboardHeader: FunctionComponent<DashboardHeaderProps> = (props) => {
    const responsive = {
        mobile: {
            breakpoint: { max: 800, min: 0 },
            items: 1,
        },
    };
    const { t } = useTranslation();
    const minutesFromLastUpdate = Math.ceil((new Date().getTime() - props.airQualityData.inserted) / 60000);

    return <Box boxShadow={2} className="dashboard-header">
        {props.currentDevice &&
            <div className="headers">
                <div className="header device-name">{props.currentDevice.name}</div>
                {props.airQualityData.inserted && <div className="last-update">
                    {minutesFromLastUpdate}
                    &nbsp;
                    {minutesFromLastUpdate === 1 ? t("minuteAgo") : t("minutesAgo")}
                </div>}
            </div>}

        <IconButton onClick={props.toggleUserDialog(true)} className="user-menu-button">
            <AccountCircleIcon />
        </IconButton>
        <IconButton component={Link} to={Pages.APP_SETTINGS_URL} className="settings-button" title={t("settings")}>
            <SettingsIcon />
        </IconButton>
        {props.isLoading && <CircularProgress size={22} className="spinner" />}


        <div className="sub-headers">
            <div className="sub-header quality">
                <AirQualityToLabel airQuality={props.average} />
            </div>
            <div className="sub-header carousel">
                {props.suggestions && props.suggestions.length > 0 && <Carousel responsive={responsive}>
                    {props.suggestions.map((s, i) => <div key={`slide-${i}`}>{s}</div>)}
                </Carousel>}
            </div>
        </div>
    </Box>;
};

export interface DashboardHeaderProps {
    suggestions: string[];
    average: number;
    currentDevice: Device | null;
    toggleUserDialog: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
    isLoading: boolean;
    airQualityData: AirQualityData;
    dateFormat: DateFormat;
}