import { LoadingState } from "./LoadingState";
import { TimeRangeReading } from "./TimeRangeReading";

export interface AirQualityDataAverages {
    yearlyAverages: TimeRangeReading[];
    monthlyAverages: TimeRangeReading[];
    dailyAverages: TimeRangeReading[];
    loadingState: LoadingState;
}