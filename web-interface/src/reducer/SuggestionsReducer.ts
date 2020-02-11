import { Action } from "redux";
import { FetchDevicesSuccessAction, FetchDevicesSuccessActionName } from "../action/FetchDevicesAction";
import { localStorageManager } from "../book/LocalStorageManager";
import { initialAppState } from "../store/InitialAppState";
import { FetchSuggestionsSuccessAction, FetchSuggestionsSuccessActionName } from './../action/FetchSuggestions';
import { AIR_QUALITY_DATA_SUGGESTIONS_KEY } from './../book/LocalStorageKeys';
import { SuggestionsData } from './../entity/SuggestionsData';

export const suggestionsReducer = (state: SuggestionsData = initialAppState.suggestionsData, action: Action): SuggestionsData => {
    switch (action.type) {
        case FetchDevicesSuccessActionName:
            const updateDevicesAction = action as FetchDevicesSuccessAction;
            if (!updateDevicesAction.devices || !updateDevicesAction.devices.length) {
                const suggestions: string[] = [];
                localStorageManager.setItem(AIR_QUALITY_DATA_SUGGESTIONS_KEY, suggestions);
                return { ...state, suggestions: suggestions };
            }
            break;
        case FetchSuggestionsSuccessActionName:
            const fetchSuggestionsSuccessAction = action as FetchSuggestionsSuccessAction;
            const suggestions = fetchSuggestionsSuccessAction.suggestions;
            localStorageManager.setItem(AIR_QUALITY_DATA_SUGGESTIONS_KEY, suggestions);
            return { ...state, suggestions: suggestions };
    }

    return state;
};