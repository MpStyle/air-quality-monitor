import { Typography } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from "recharts";
import { TimeRangeReading } from "../../entity/TimeRangeReading";
import "./Chart.scss";

const ChartTooltip = (props: TooltipProps & { readingsType: string, readingUnitMeter: string }) => {
    if (props.active && !!props.payload) {
        return <div className="chart-tooltip">
            <div className="label"><strong>{props.readingsType}</strong>: {props.payload[0].value}{props.readingUnitMeter}</div>
            <div><strong>Reading date</strong>: {props.payload[0].payload.datetime}</div>
        </div>;
    }

    return null;
};

export const Chart: FunctionComponent<ChartProps> = (props) => {
    const chartInfo = props.averages.reduce((acc, curr): ChartInfo => ({
        maxValue: Math.max(acc.maxValue ?? Math.floor(curr.average), Math.floor(curr.average)),
        minValue: Math.min(acc.minValue ?? Math.floor(curr.average), Math.floor(curr.average)),
    }), {} as ChartInfo);
    const yAxisWidth = chartInfo.maxValue < 1000 ? (chartInfo.maxValue < 100 ? 20 : 30) : 35;

    return <div className="chart">
        <Typography variant="h6" className="title">{props.title}</Typography>
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={props.averages} maxBarSize={50}>
                <Tooltip
                    content={<ChartTooltip readingsType={props.readingType} readingUnitMeter={props.readingUnitMeter} />}
                    cursor={{ fill: '#f5f5f5' }} />
                <Line type="monotone" dataKey="average" fill="#d4d4d4" />
                <XAxis dataKey="xaxis" />
                <YAxis width={yAxisWidth} domain={[chartInfo.minValue - 2, chartInfo.maxValue + 2]} />
                <CartesianGrid strokeDasharray="0 0" vertical={false} />
            </LineChart>
        </ResponsiveContainer>
    </div>;
};

export interface ChartProps {
    averages: (TimeRangeReading & { average: number, xaxis: string, datetime: string })[];
    title: string;
    readingType: string;
    readingUnitMeter: string;
}

interface ChartInfo {
    maxValue: number;
    minValue: number;
}