import { Action } from "redux";
import { UpdateDecimalSeparatorAction, UpdateDecimalSeparatorActionName } from "../action/UpdateDecimalSeparatorAction";
import { AIR_QUALITY_DATA_DECIMAL_SEPARATOR_KEY } from "../book/LocalStorageKeys";
import { initialAppState } from "../store/InitialAppState";

export const decimalSeparatorReducer = (state: string = initialAppState.decimalSeparator, action: Action): string => {
    switch (action.type) {
        case UpdateDecimalSeparatorActionName:
            const updateDecimalSeparatorAction = action as UpdateDecimalSeparatorAction;
            localStorage.setItem(AIR_QUALITY_DATA_DECIMAL_SEPARATOR_KEY, updateDecimalSeparatorAction.separator);
            return updateDecimalSeparatorAction.separator;
    }
    return state;
};