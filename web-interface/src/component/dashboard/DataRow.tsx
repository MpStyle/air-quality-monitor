import Badge from '@material-ui/core/Badge/Badge';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { airQualityToClassName } from '../../book/AirQualityToClassName';
import { IconVisualizationType } from '../../book/IconVisualizationType';
import { AirQuality } from '../../entity/AirStatus';
import warning from '../../images/warning.svg';
import { AirQualityToLabel } from '../common/AirQualityToLabel';
import { Pages } from './../../book/Pages';
import './DataRow.scss';

export const DataRow: FunctionComponent<DataRowProps> = (props: DataRowProps) => {
    if (!props.value) {
        return null;
    }

    const RowIcon = () => <img src={props.icon} className="value-icon" alt={props.title} />;

    const QualityRowIcon = () => {
        if (props.quality === AirQuality.VeryBad) {
            return <Badge badgeContent={"!"} color="error">
                <RowIcon />
            </Badge>;
        }

        return <RowIcon />;
    };

    return <Link to={`${Pages.CHARTS_URL}/${props.measurementType}`} className="data" title={props.title}>
        {(props.iconVisualizationType === IconVisualizationType.icon || props.iconVisualizationType === IconVisualizationType.both) && <span className="icon">
            <QualityRowIcon />
        </span>}
        {(props.iconVisualizationType === IconVisualizationType.label || props.iconVisualizationType === IconVisualizationType.both) && <span className="label">
            {props.title}
        </span>}
        <span className={`value ${airQualityToClassName(props.quality)}`}>
            {props.value} <span className="unit">{props.meter}</span>
        </span>
        <span className={`quality-level ${airQualityToClassName(props.quality)}`}>
            {props.quality === AirQuality.VeryBad && <img src={warning} className="warning-icon" alt="Warning" />}
            <AirQualityToLabel airQuality={props.quality} />
        </span>
        <span className="details">
            <ArrowForwardIosIcon />
        </span>
    </Link>;
};

export interface DataRowProps {
    title: string;
    icon: string;
    value: number | string;
    meter: string;
    quality: AirQuality;
    iconVisualizationType: IconVisualizationType;
    measurementType: string;
}