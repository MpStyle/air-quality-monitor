import { AirQualityData } from "../entity/AirQualityData";

export const fetchAirQualityData = (currentDeviceId: string): Promise<AirQualityData[]> => {
    return new Promise((resolve, _reject) => {
        setTimeout(function () {
            resolve([
                {
                    co2: 400,
                    humidity: 60,
                    inserted: 1576247467000,
                    pressure: 82,
                    temperature: 21,
                    tvoc: 300
                } as AirQualityData
            ]);
        }, 100);
    });

    // const url = process.env.REACT_APP_AIR_QUALITY_DATA_REMOTE_URL as string;
    // return fetch(`${url}/airQualityData?_page=1&_limit=1&_sort=inserted&_order=desc&deviceId=${currentDeviceId}`)
    //     .then((response): Promise<AirQualityData[]> => {
    //         if (!response.ok) {
    //             console.error(`Error while fetch air quality data`);
    //             return Promise.resolve([]);
    //         }

    //         return response.json();
    //     });
};