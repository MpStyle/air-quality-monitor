import { LoadingState } from "./LoadingState";
import { TimeRangeMeasurement } from "./TimeRangeMeasurement";

export interface AirQualityDataAverages {
    yearlyAverages: TimeRangeMeasurement[];
    monthlyAverages: TimeRangeMeasurement[];
    dailyAverages: TimeRangeMeasurement[];
    loadingState: LoadingState;
}