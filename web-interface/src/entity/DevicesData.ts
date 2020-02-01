import { Device } from "./Device";
import { LoadingState } from "./LoadingState";

export interface DevicesData {
    devices: Device[];
    loadingState: LoadingState;
    deletingState: LoadingState;
}