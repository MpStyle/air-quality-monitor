import { Device } from '../entity/Device';

export const fetchDevices = (): Promise<Device[]> => {
    return new Promise((resolve, _reject) => {
        setTimeout(function () {
            resolve([
                {
                    id: "1",
                    name: "Ingresso"
                } as Device
            ]);
        }, 100);
    });

    // const url = process.env.REACT_APP_AIR_QUALITY_DATA_REMOTE_URL as string;
    // return fetch(`${url}/device`)
    //     .then((response): Promise<Device[]> => {
    //         if (!response.ok) {
    //             console.error(`Error while fetch devices`);
    //             return Promise.resolve([]);
    //         }

    //         return response.json();
    //     });
};