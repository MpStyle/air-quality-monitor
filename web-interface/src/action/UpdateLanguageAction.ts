import { Action } from 'redux';

export const UpdateLanguageActionName = 'UpdateLanguageAction';

export interface UpdateLanguageAction extends Action {
    language: string;
}

export const updateLanguageActionBuilder = (language: string): UpdateLanguageAction => {
    return {
        type: UpdateLanguageActionName,
        language
    };
};