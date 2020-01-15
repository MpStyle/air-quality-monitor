import { Granularity } from "./Granularity";

export interface TimeRangeMeasurement {
    deviceId: string;
    type: string;
    value: number;
    counter: number;
    timeRange: string; // use this field as ID
    granularity: Granularity;
}