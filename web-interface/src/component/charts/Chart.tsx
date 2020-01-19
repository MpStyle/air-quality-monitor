import { Typography } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from "recharts";
import { TimeRangeReading } from "../../entity/TimeRangeReading";
import "./Chart.scss";

const ChartTooltip = (props: TooltipProps & { readingsType: string, readingUnitMeter: string }) => {
    if (props.active && !!props.payload) {
        return <div className="chart-tooltip">
            <div className="label"><strong>{props.readingsType}</strong>: {props.payload[0].value}{props.readingUnitMeter}</div>
            <div><strong>Reading date</strong>: {props.label}</div>
        </div>;
    }

    return null;
};

export const Chart: FunctionComponent<ChartProps> = (props) => {
    const maxAverage = props.averages.reduce((acc, curr) => { return acc > curr.average ? acc : curr.average; }, 0);
    const yAxisWidth = maxAverage < 1000 ? (maxAverage < 100 ? 20 : 30) : 35;

    return <div className="chart">
        <Typography variant="h6" className="title">{props.title}</Typography>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={props.averages} maxBarSize={50}>
                <Bar dataKey="average" fill="#e1e1e1" />
                <XAxis dataKey="xaxis" />
                <YAxis width={yAxisWidth} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip content={<ChartTooltip readingsType={props.readingType} readingUnitMeter={props.readingUnitMeter} />} />
            </BarChart>
        </ResponsiveContainer>
    </div>;
};

export interface ChartProps {
    averages: (TimeRangeReading & { average: number, xaxis: string })[];
    title: string;
    readingType: string;
    readingUnitMeter: string;
}