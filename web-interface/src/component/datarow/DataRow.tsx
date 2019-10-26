import React from 'react';
import { airQualityToClassName } from '../../book/AirQualityToClassName';
import { airQualityToLabel } from '../../book/QualityLabel';
import { AirQuality } from '../../entity/AirStatus';
import warning from '../../images/warning.svg';

export const DataRow: React.FC<DataRowProps> = (props: DataRowProps) => {
    return <div className="data" title={props.title}>
        <span className="icon">
            <img src={props.icon} className="value-icon" alt="Humidity" />
        </span>
        <span className={`value ${airQualityToClassName(props.quality)}`}>
            {props.value} <span className="unit">{props.meter}</span>
        </span>
        <span className={`quality-level ${airQualityToClassName(props.quality)}`}>
            {props.quality === AirQuality.VeryBad && <img src={warning} className="warning-icon" alt="Warning" />}
            {airQualityToLabel(props.quality)}
        </span>
    </div>;
};

export interface DataRowProps {
    title: string;
    icon: string;
    value: number;
    meter: string;
    quality: AirQuality;
}