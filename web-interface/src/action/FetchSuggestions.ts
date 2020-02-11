import { Action } from 'redux';

// Start

export const FetchSuggestionsStartActionName = 'FetchSuggestionsStartAction';

export interface FetchSuggestionsStartAction extends Action {
}

export const fetchSuggestionsStartActionBuilder = (): FetchSuggestionsStartAction => {
    return {
        type: FetchSuggestionsStartActionName
    };
};

// Success

export const FetchSuggestionsSuccessActionName = 'FetchSuggestionsSuccessAction';

export interface FetchSuggestionsSuccessAction extends Action {
    suggestions: string[];
}

export const fetchSuggestionsSuccessActionBuilder = (suggestions: string[]): FetchSuggestionsSuccessAction => {
    return {
        type: FetchSuggestionsSuccessActionName,
        suggestions: suggestions
    };
};

// Error

export const FetchSuggestionsErrorActionName = 'FetchSuggestionsErrorAction';

export interface FetchSuggestionsErrorAction extends Action {
    error: number;
}

export const fetchSuggestionsErrorActionBuilder = (error: number): FetchSuggestionsErrorAction => {
    return {
        type: FetchSuggestionsErrorActionName,
        error
    };
};