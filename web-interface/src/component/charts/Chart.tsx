import { Typography } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { Bar, BarChart, CartesianGrid, Label, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { TimeRangeMeasurement } from "../../entity/TimeRangeMeasurement";
import "./Chart.scss";

export const Chart: FunctionComponent<ChartProps> = (props) => {
    return <div className="chart">
        <Typography variant="h6" className="title">{props.title}</Typography>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={props.averages} maxBarSize={50}>
                <Bar dataKey="average" fill="#e1e1e1" />
                <XAxis dataKey="xaxis" />
                <YAxis >
                    <Label value={props.unitMeter} position="insideTopLeft" />
                </YAxis>
                <CartesianGrid strokeDasharray="3 3" />
            </BarChart>
        </ResponsiveContainer>
    </div>;
};

export interface ChartProps {
    averages: (TimeRangeMeasurement | { average: number, xaxis: string })[];
    title: string;
    unitMeter: string;
}