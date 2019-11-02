import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import { Link } from "react-router-dom";
import { airQualityToLabel } from '../../book/AirQualityToLabel';
import { averageAirStatus } from '../../book/AverageAirStatus';
import { AirStatus } from '../../entity/AirStatus';
import { Device } from '../../entity/Device';
import info from '../../images/info.svg';
import '../../sass/Header.scss';
import './Header.scss';

export const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
    const average = averageAirStatus(props.airStatus);
    return <header className={`header home-header md-header`}>
        <div className="sub-header first">
            <select
                value={props.currentDeviceId || (props.devices && props.devices.length && props.devices[0].id)}
                onChange={event => props.onCurrentDeviceIdChange(event.target.value)}>
                {props.devices.map((device) => (
                    <option key={device.id} value={device.id}>{device.name}</option>
                ))}
            </select>

            <div className="md-icon">
                <Link to="/credits">
                    <img src={info} alt="Credits" />
                </Link>
            </div>
        </div>

        <div className="sub-header second">
            {airQualityToLabel(average)}
        </div>

        <div className="sub-header third">
            {props.suggestions && props.suggestions.length > 0 && <AliceCarousel buttonsDisabled={true}>
                {props.suggestions.map((s, i) => <div key={`slide-${i}`}>{s}</div>)}
            </AliceCarousel >}
        </div>
    </header>;
};

export interface HeaderProps {
    airStatus: AirStatus;
    currentDeviceId: string | null;
    devices: Device[];
    suggestions: string[];
    onCurrentDeviceIdChange: (deviceId: string) => void;
}