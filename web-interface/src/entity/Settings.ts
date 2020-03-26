import { IconVisualizationType } from "../book/IconVisualizationType";
import { DateFormat } from "./DateFormat";
import { MeterUnit } from "./MeterUnit";
import { ShortDateFormat } from "./ShortDateFormat";

export interface Settings {
    language: string;
    iconVisualizationType: IconVisualizationType;
    decimalSeparator: string;
    meterUnit: MeterUnit;
    dateFormat: DateFormat;
    shortDateFormat: ShortDateFormat;
}