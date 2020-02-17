import { Granularity } from "./Granularity";

export interface TimeRangeReading {
    deviceId: string,
    type: string,
    value: number,
    counter: number,
    timeRange: string // use this field as ID
    granularity: Granularity;
    inserted: number;
    updated: number;
}