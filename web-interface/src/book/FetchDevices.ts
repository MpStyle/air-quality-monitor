import { Dispatch } from "react";
import { Action } from "redux";
import { updateDevicesActionBuilder } from "../action/UpdateDevicesAction";
import { Device } from '../entity/Device';

export const fetchDevices = (dispatch: Dispatch<Action>) => {
    const url = process.env.REACT_APP_AIR_QUALITY_DATA_REMOTE_URL as string;
    fetch(`${url}/device`)
        .then((response): Promise<Device[]> => {
            if (!response.ok) {
                console.error(`Error while fetch devices`);
                return Promise.resolve([]);
            }

            return response.json();
        })
        .then((response: Device[]) => {
            dispatch(updateDevicesActionBuilder(response));
        })
        .catch((error) => {
            // TODO: dispatch an error message
            console.error(`Error while fetch devices: ${error}`);
        });
};