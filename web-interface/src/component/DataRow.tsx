import React, { FunctionComponent } from 'react';
import { airQualityToClassName } from '../book/AirQualityToClassName';
import { airQualityToLabel } from '../book/AirQualityToLabel';
import { IconVisualizationType } from '../book/IconVisualizationType';
import { AirQuality } from '../entity/AirStatus';
import warning from '../images/warning.svg';
import './DataRow.scss';

export const DataRow: FunctionComponent<DataRowProps> = (props: DataRowProps) => {
    if (!props.value) {
        return null;
    }

    return <div className="data" title={props.title}>
        {(props.iconVisualizationType === IconVisualizationType.icon || props.iconVisualizationType === IconVisualizationType.both) && <span className="icon">
            <img src={props.icon} className="value-icon" alt={props.title} />
        </span>}
        {(props.iconVisualizationType === IconVisualizationType.label || props.iconVisualizationType === IconVisualizationType.both) && <span className="label">
            {props.title}
        </span>}
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
    value: number | string;
    meter: string;
    quality: AirQuality;
    iconVisualizationType: string;
}