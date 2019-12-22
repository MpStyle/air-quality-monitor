import { Action } from 'redux';

export const UpdateTemperatureUnitActionName = 'UpdateTemperatureUnitAction';

export interface UpdateTemperatureUnitAction extends Action {
    temperatureUnit: string;
}

export const updateTemperatureUnitActionBuilder = (temperatureUnit: string): UpdateTemperatureUnitAction => {
    return {
        type: UpdateTemperatureUnitActionName,
        temperatureUnit
    };
};