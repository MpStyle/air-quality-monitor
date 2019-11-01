import { Action, Dispatch } from "redux";
import { updateAirQualityDataActionBuilder } from "../action/UpdateAirQualityDataAction";
import { AirQualityData } from "../entity/AirQualityData";

export const fetchAirQualityData = (currentDeviceId: string, dispatch: Dispatch<Action>) => {
    const url = process.env.REACT_APP_AIR_QUALITY_DATA_REMOTE_URL as string;
    fetch(`${url}/airQualityData?_page=1&_limit=1&_sort=inserted&_order=desc&deviceId=${currentDeviceId}`)
        .then((response): Promise<AirQualityData[]> => {
            return response.json();
        })
        .then((response: AirQualityData[]) => {
            dispatch(updateAirQualityDataActionBuilder(response[0]));
        })
        .catch((_error) => {
            // TODO: dispatch an error message
        });
};