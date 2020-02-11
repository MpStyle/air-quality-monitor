import { Action } from "redux";
import { FetchDevicesSuccessAction, FetchDevicesSuccessActionName } from "../action/FetchDevicesAction";
import { LocalStorageKey } from "../book/LocalStorageKey";
import { localStorageManager } from "../book/LocalStorageManager";
import { LoadingState } from "../entity/LoadingState";
import { initialAppState } from "../store/InitialAppState";
import { FetchSuggestionsErrorActionName, FetchSuggestionsStartActionName, FetchSuggestionsSuccessAction, FetchSuggestionsSuccessActionName } from './../action/FetchSuggestions';
import { SuggestionsData } from './../entity/SuggestionsData';

export const suggestionsReducer = (state: SuggestionsData = initialAppState.suggestionsData, action: Action): SuggestionsData => {
    const emptySuggestions: string[] = [];

    switch (action.type) {
        case FetchDevicesSuccessActionName:
            const updateDevicesAction = action as FetchDevicesSuccessAction;
            if (!updateDevicesAction.devices || !updateDevicesAction.devices.length) {
                localStorageManager.setItem(LocalStorageKey.SUGGESTIONS_KEY, emptySuggestions);
                return { ...state, suggestions: emptySuggestions };
            }
            break;
        case FetchSuggestionsStartActionName:
            localStorageManager.setItem(LocalStorageKey.SUGGESTIONS_KEY, emptySuggestions);
            return { ...state, suggestions: emptySuggestions, loadingState: LoadingState.loading };
        case FetchSuggestionsSuccessActionName:
            const fetchSuggestionsSuccessAction = action as FetchSuggestionsSuccessAction;
            const suggestions = fetchSuggestionsSuccessAction.suggestions;
            localStorageManager.setItem(LocalStorageKey.SUGGESTIONS_KEY, suggestions);
            return { ...state, suggestions: suggestions, loadingState: LoadingState.success };
        case FetchSuggestionsErrorActionName:
            localStorageManager.setItem(LocalStorageKey.SUGGESTIONS_KEY, emptySuggestions);
            return { ...state, suggestions: emptySuggestions, loadingState: LoadingState.loading };
    }

    return state;
};