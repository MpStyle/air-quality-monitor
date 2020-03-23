import { Typography } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Colors } from "../../book/Colors";
import { TimeRangeReading } from "../../entity/TimeRangeReading";
import "./Chart.scss";
import { ChartTooltip } from "./ChartTooltip";

export const Chart: FunctionComponent<ChartProps> = (props) => {
    const chartInfo = props.averages.reduce((acc, curr): ChartInfo => ({
        maxValue: Math.max(acc.maxValue ?? Math.floor(curr.average), Math.floor(curr.average)),
        minValue: Math.min(acc.minValue ?? Math.floor(curr.average), Math.floor(curr.average)),
    }), {} as ChartInfo);
    const yAxisWidth = chartInfo.maxValue < 1000 ? (chartInfo.maxValue < 100 ? 20 : 30) : 35;

    return <div className="chart">
        <Typography variant="h6" className="title">{props.title}</Typography>
        <Typography variant="subtitle2" color="textSecondary" className="subtitle">{props.subtitle}</Typography>
        {props.averages.length === 0 && <div>No data</div>}
        {props.averages.length > 0 && <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={props.averages} maxBarSize={50}>
                <defs>
                    <linearGradient id="coloraverage" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={`${Colors.PRIMARY}99`} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={`${Colors.PRIMARY}99`} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <Tooltip
                    content={<ChartTooltip readingsType={props.readingType} readingUnitMeter={props.readingUnitMeter} />}
                    cursor={{ fill: '#f5f5f5' }} />
                <Area type="monotone" dataKey="average" stroke={Colors.PRIMARY} fillOpacity={1} fill="url(#coloraverage)" />
                <XAxis dataKey="xaxis" />
                <YAxis width={yAxisWidth} domain={[chartInfo.minValue - 2, chartInfo.maxValue + 2]} />
                <CartesianGrid strokeDasharray="0 0" vertical={false} />
            </AreaChart>
        </ResponsiveContainer>}
    </div>;
};

export interface ChartProps {
    averages: Average[];
    title: string;
    subtitle: string;
    readingType: string;
    readingUnitMeter: string;
}

export interface Average extends TimeRangeReading {
    average: number;
    formattedAverage: string;
    xaxis: string;
    datetime: string;
}

interface ChartInfo {
    maxValue: number;
    minValue: number;
}