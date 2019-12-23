import { Action } from 'redux';

export const UpdateDecimalSeparatorActionName = 'UpdateDecimalSeparatorAction';

export interface UpdateDecimalSeparatorAction extends Action {
    separator: string;
}

export const updateDecimalSeparatorActionBuilder = (separator: string): UpdateDecimalSeparatorAction => {
    return {
        type: UpdateDecimalSeparatorActionName,
        separator
    };
};