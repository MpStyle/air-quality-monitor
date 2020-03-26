import React from "react";
import { TooltipProps } from "recharts";
import { Granularity } from "../../entity/Granularity";

export const ChartTooltip = (props: ChartTooltipProps & TooltipProps) => {
    if (props.active && !!props.payload) {
        let label = '';
        switch (props.payload[0].payload.granularity) {
            case Granularity.daily:
                label = 'hour';
                break;
            case Granularity.monthly:
                label = 'day';
                break;
            case Granularity.yearly:
                label = 'month';
                break;
        }

        return <div className="chart-tooltip">
            <div className="label"><strong>{props.readingsType}</strong>: {props.payload[0].payload.formattedAverage}{props.readingUnitMeter}</div>
            <div><strong>Reading date</strong>: {props.payload[0].payload.datetime}</div>
            <div><strong>Readings per {label}</strong>: {props.payload[0].payload.counter}</div>
        </div>;
    }

    return null;
};

export interface ChartTooltipProps {
    readingsType: string;
    readingUnitMeter: string;
}