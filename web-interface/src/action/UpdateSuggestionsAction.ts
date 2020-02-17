import { Action } from 'redux';

export const UpdateSuggestionsActionName = 'UpdateSuggestionsAction';

export interface UpdateSuggestionsAction extends Action {
    suggestions: string[];
}

export const updateSuggestionsActionBuilder = (suggestions: string[]): UpdateSuggestionsAction => {
    return {
        type: UpdateSuggestionsActionName,
        suggestions: suggestions
    };
};