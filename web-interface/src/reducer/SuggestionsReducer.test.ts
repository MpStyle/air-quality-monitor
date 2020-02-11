import { fetchSuggestionsSuccessActionBuilder } from "../action/FetchSuggestions";
import { LocalStorageKey } from "../book/LocalStorageKey";
import { LoadingState } from "../entity/LoadingState";
import { localStorageManager } from './../book/LocalStorageManager';
import { initialAppState } from './../store/InitialAppState';
import { suggestionsReducer } from './SuggestionsReducer';

it('SuggestionReducer', () => {
    const suggestion01 = 'suggestion-01';
    const suggestion02 = 'suggestion-02';
    const state = suggestionsReducer(initialAppState.suggestionsData, fetchSuggestionsSuccessActionBuilder([suggestion01, suggestion02]));

    expect(state?.suggestions[0]).toEqual(suggestion01);
    expect(state?.suggestions[1]).toEqual(suggestion02);

    const localStorageState = localStorageManager.getItem<string[]>(LocalStorageKey.SUGGESTIONS_KEY) as string[];

    expect(localStorageState[0]).toEqual(suggestion01);
    expect(localStorageState[1]).toEqual(suggestion02);
});

it('SuggestionReducer - empty suggestions', () => {
    const state = suggestionsReducer(initialAppState.suggestionsData, fetchSuggestionsSuccessActionBuilder([]));

    expect(state?.suggestions.length).toEqual(0);
    expect(state?.loadingState).toEqual(LoadingState.success);

    const localStorageState = localStorageManager.getItem<string[]>(LocalStorageKey.SUGGESTIONS_KEY) as string[];

    expect(localStorageState.length).toEqual(0);
});