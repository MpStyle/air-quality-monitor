import { Typography } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { Bar, BarChart, CartesianGrid, Label, ResponsiveContainer, XAxis, YAxis, Tooltip, TooltipProps } from "recharts";
import { TimeRangeReading } from "../../entity/TimeRangeReading";
import "./Chart.scss";

const CustomTooltip = (props: TooltipProps) => {
    if (props.active && !!props.payload) {
        return <div className="custom-tooltip">
            <p className="label">{`${props.label} : ${props.payload[0].value}`}</p>
        </div>;
    }

    return null;
};

export const Chart: FunctionComponent<ChartProps> = (props) => {
    return <div className="chart">
        <Typography variant="h6" className="title">{props.title}</Typography>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={props.averages} maxBarSize={50}>
                <Bar dataKey="average" fill="#e1e1e1">
                    <Tooltip content={<CustomTooltip />} />
                </Bar>
                <XAxis dataKey="xaxis" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
            </BarChart>
        </ResponsiveContainer>
    </div>;
};

export interface ChartProps {
    averages: (TimeRangeReading | { average: number, xaxis: string })[];
    title: string;
}