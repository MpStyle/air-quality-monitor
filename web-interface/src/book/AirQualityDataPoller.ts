import { Action, Store } from "redux";
import { updateCurrentDeviceIdActionBuilder } from "../action/UpdateCurrentDeviceIdAction";
import { AirQualityData } from "../entity/AirQualityData";
import { AppState } from "../entity/AppState";
import { updateAirQualityDataActionBuilder } from './../action/UpdateAirQualityDataAction';

export const airQualityDataPoller = (store: Store<AppState, Action>) => {
    if (store.getState().currentDevice != null) {
        const url = process.env.REACT_APP_AIR_QUALITY_DATA_REMOTE_URL as string;
        fetch(`${url}/airQualityData?_page=1&_limit=1&_sort=inserted&_order=desc&deviceId=${store.getState().currentDevice}`)
            .then((response): Promise<AirQualityData[]> => {
                return response.json();
            })
            .then((response: AirQualityData[]) => {
                store.dispatch(updateAirQualityDataActionBuilder(response[0]));

                setTimeout(() => airQualityDataPoller(store), parseInt(process.env.REACT_APP_AIR_QUALITY_DATA_REFRESH_TIME as string));
            })
            .catch((_error) => {
                // TODO: dispatch an error message
            });
    }
    else if (store.getState().devices && store.getState().devices.length) {
        store.dispatch(updateCurrentDeviceIdActionBuilder(store.getState().devices[0].id));
        airQualityDataPoller(store);
    }
    else {
        setTimeout(() => airQualityDataPoller(store), 1000);
    }
};