import Paper from "@material-ui/core/Paper/Paper";
import React, { useEffect, useState, FunctionComponent } from "react";
import { epochToDate, monthNames, weekDayNames } from "../book/DateTimeUtils";
import "./Weather.scss";

export const Weather: FunctionComponent<{}> = () => {
    const [weaterState, setWeatherState] = useState<WeatherState | null>(null);
    const appKey = process.env.REACT_APP_AIR_QUALITY_DATA_WHEATER_APP_KEY as string;
    const city = process.env.REACT_APP_AIR_QUALITY_DATA_WHEATER_CITY as string;

    useEffect(() => {
        const poller = () => {
            fetch(`http://api.weatherstack.com/current?access_key=${appKey}&query=${city}`)
                .then(response => response.json())
                .then((data: WeatherInfo) => {
                    setWeatherState(data);

                    setTimeout(() => poller(), 31 * 24 * 60 * 60 * 1000 / 1000);
                })
                .catch(error => console.log("Error while fetching health data", error));
        };
        if (!appKey) {
            poller();
        }
    }, []);

    const epoch = weaterState?.location?.localtime_epoch;

    if (!weaterState || !epoch) {
        return <React.Fragment />;
    }

    const date = epochToDate(epoch);

    return <React.Fragment>
        {weaterState && <Paper elevation={1} className="weather">
            <div className="table">
                <div className="col">
                    <div className="row icon-container">
                        <img src={weaterState.current.weather_icons[0]} />
                    </div>
                </div>
                <div className="col">
                    <div className="row current-temperature-description-container">
                        <span className="current-temperature">{weaterState.current.temperature}° C |</span> <span className="description">{weaterState.current.weather_descriptions[0]}</span>
                    </div>
                    <div className="row date-container">
                        {weekDayNames()[date.getDay()]}, {date.getDate()} {monthNames()[date.getMonth()]}
                    </div>
                    <div className="row location-container">
                        {weaterState.location.name} - {weaterState.location.region} - {weaterState.location.country}
                    </div>
                </div>
            </div>
        </Paper>}
    </React.Fragment>;
};

interface WeatherState extends WeatherInfo { }
interface WeatherInfoLocation {
    name: string;
    country: string;
    region: string;
    lat: string;
    lon: string;
    timezone_id: string;
    localtime: string;
    localtime_epoch: number;
    utc_offset: string;
}

interface WeatherInfoRequest {
    type: string;
    query: string;
    language: string;
    unit: string;
}
interface WeatherInfoCurrent {
    observation_time: string;
    temperature: number;
    weather_code: number;
    weather_icons: string[];
    weather_descriptions: string[];
    wind_speed: number;
    wind_degree: number;
    wind_dir: string;
    pressure: number;
    precip: number;
    humidity: number;
    cloudcover: number;
    feelslike: number;
    uv_index: number;
    visibility: number;
    is_day: string;
}
interface WeatherInfo {
    request: WeatherInfoRequest;
    location: WeatherInfoLocation;
    current: WeatherInfoCurrent;
}