import { Action } from "redux";
import { FetchDevicesSuccessAction, FetchDevicesSuccessActionName } from "../action/FetchDevicesAction";
import { FetchLastReadingsSuccessAction, FetchLastReadingsSuccessActionName } from "../action/FetchLastReadingsAction";
import { LocalStorageKey } from "../book/LocalStorageKey";
import { localStorageManager } from "../book/LocalStorageManager";
import { initialAppState } from "../store/InitialAppState";

export const suggestionsReducer = (state: string[] = initialAppState.suggestions, action: Action): string[] => {
    const emptySuggestions: string[] = [];

    switch (action.type) {
        case FetchDevicesSuccessActionName:
            const updateDevicesAction = action as FetchDevicesSuccessAction;
            if (!updateDevicesAction.devices || !updateDevicesAction.devices.length) {
                localStorageManager.setItem(LocalStorageKey.SUGGESTIONS_KEY, emptySuggestions);
                return emptySuggestions;
            }
            break;
        case FetchLastReadingsSuccessActionName:
            const suggestions = (action as FetchLastReadingsSuccessAction).lastReadings?.suggestions ?? [];

            localStorageManager.setItem(LocalStorageKey.SUGGESTIONS_KEY, suggestions);

            return suggestions;
    }

    return state;
};