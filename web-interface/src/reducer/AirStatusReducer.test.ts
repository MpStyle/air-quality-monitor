import { FetchAirQualityDataSuccessAction } from "../action/FetchAirQualityDataSuccessAction";
import { FetchAirQualityDataSuccessActionName } from '../action/FetchAirQualityDataSuccessAction';
import { AirQuality, AirStatus } from "../entity/AirStatus";
import { AirQualityData } from './../entity/AirQualityData';
import { initialAppState } from './../store/InitialAppState';
import { airStatusReducer } from "./AirStatusReducer";

it('AirStatusReducer - Excellent', () => {
    const status = airStatusReducer(initialAppState.airStatus, {
        type: FetchAirQualityDataSuccessActionName,
        data: {
            co2: 400,
            humidity: 55,
            temperature: 25,
            tvoc: 0,
            noise: 40
        } as AirQualityData
    } as FetchAirQualityDataSuccessAction);

    expect(status.co2).toEqual(AirQuality.Excellent);
    expect(status.humidity).toEqual(AirQuality.Excellent);
    expect(status.temperature).toEqual(AirQuality.Excellent);
    expect(status.tvoc).toEqual(AirQuality.Excellent);
    expect(status.noise).toEqual(AirQuality.Excellent);
});

it('AirStatusReducer - Good', () => {
    const status = airStatusReducer(initialAppState.airStatus, {
        type: FetchAirQualityDataSuccessActionName,
        data: {
            co2: 701,
            humidity: 40,
            temperature: 18,
            tvoc: 0,
            noise: 71
        } as AirQualityData
    } as FetchAirQualityDataSuccessAction);

    expect(status.co2).toEqual(AirQuality.Good);
    expect(status.humidity).toEqual(AirQuality.Good);
    expect(status.temperature).toEqual(AirQuality.Good);
    expect(status.tvoc).toEqual(AirQuality.Excellent);
    expect(status.noise).toEqual(AirQuality.Good);
});

it('AirStatusReducer - Not Good', () => {
    const status = airStatusReducer(initialAppState.airStatus, {
        type: FetchAirQualityDataSuccessActionName,
        data: {
            co2: 1001,
            humidity: 70,
            temperature: 9,
            tvoc: 0,
            noise: 101
        } as AirQualityData
    } as FetchAirQualityDataSuccessAction);

    expect(status.co2).toEqual(AirQuality.NotGood);
    expect(status.humidity).toEqual(AirQuality.NotGood);
    expect(status.temperature).toEqual(AirQuality.NotGood);
    expect(status.tvoc).toEqual(AirQuality.Excellent);
    expect(status.noise).toEqual(AirQuality.NotGood);
});

it('AirStatusReducer - Very bad', () => {
    const status = airStatusReducer(initialAppState.airStatus, {
        type: FetchAirQualityDataSuccessActionName,
        data: {
            co2: 1601,
            humidity: 0,
            temperature: 36,
            tvoc: 0.8,
            noise: 121
        } as AirQualityData
    } as FetchAirQualityDataSuccessAction);

    expect(status.co2).toEqual(AirQuality.VeryBad);
    expect(status.humidity).toEqual(AirQuality.VeryBad);
    expect(status.temperature).toEqual(AirQuality.VeryBad);
    expect(status.tvoc).toEqual(AirQuality.VeryBad);
    expect(status.noise).toEqual(AirQuality.VeryBad);
});
