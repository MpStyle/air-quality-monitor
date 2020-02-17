import { Action } from "redux";
import { FetchDevicesSuccessAction, FetchDevicesSuccessActionName } from "../action/FetchDevicesAction";
import { UpdateSuggestionsAction, UpdateSuggestionsActionName } from '../action/UpdateSuggestionsAction';
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
        case UpdateSuggestionsActionName:
            const fetchSuggestionsSuccessAction = action as UpdateSuggestionsAction;
            const suggestions = fetchSuggestionsSuccessAction.suggestions;
            localStorageManager.setItem(LocalStorageKey.SUGGESTIONS_KEY, suggestions);
            return suggestions;
    }

    return state;
};