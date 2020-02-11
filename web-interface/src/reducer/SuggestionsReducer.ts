import { Action } from "redux";
import { FetchDevicesSuccessAction, FetchDevicesSuccessActionName } from "../action/FetchDevicesAction";
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
                localStorage.setItem(AIR_QUALITY_DATA_SUGGESTIONS_KEY, JSON.stringify(suggestions));
                return { ...state, suggestions: suggestions };
            }
            break;
        case FetchSuggestionsSuccessActionName:
            const fetchSuggestionsSuccessAction = action as FetchSuggestionsSuccessAction;
            const suggestions = fetchSuggestionsSuccessAction.suggestions;
            localStorage.setItem(AIR_QUALITY_DATA_SUGGESTIONS_KEY, JSON.stringify(suggestions));
            return { ...state, suggestions: suggestions };
    }

    return state;
};