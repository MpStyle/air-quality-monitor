import { Action } from 'redux';
import { ShortDateFormat } from '../entity/ShortDateFormat';

export const UpdateShortDateFormatActionName = 'UpdateShortDateFormatAction';

export interface UpdateShortDateFormatAction extends Action {
    shortDateFormat: ShortDateFormat;
}

export const updateShortDateFormatActionBuilder = (shortDateFormat: ShortDateFormat): UpdateShortDateFormatAction => {
    return {
        type: UpdateShortDateFormatActionName,
        shortDateFormat
    };
};