import { IconVisualizationType } from "../book/IconVisualizationType";
import { MeterUnit } from "./MeterUnit";

export interface Settings {
    iconVisualizationType: IconVisualizationType;
    decimalSeparator: string;
    meterUnit: MeterUnit;
}