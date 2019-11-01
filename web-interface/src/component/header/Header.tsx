import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import { averageAirStatus } from '../../book/AverageAirStatus';
import { airQualityToLabel } from '../../book/AirQualityToLabel';
import { AirStatus } from '../../entity/AirStatus';
import { Device } from '../../entity/Device';
import './Header.scss';

export const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
    const average = averageAirStatus(props.airStatus);
    return <header className={`header home-header`}>
        <div className="sub-header first">
            <select
                value={props.currentDeviceId || (props.devices && props.devices.length && props.devices[0].id)}
                onChange={event => props.onCurrentDeviceIdChange(event.target.value)}>
                {props.devices.map((device) => (
                    <option key={device.id} value={device.id}>{device.name}</option>
                ))}
            </select>
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