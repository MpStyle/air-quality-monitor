import { Action } from 'redux';
import { DateFormat } from '../entity/DateFormat';

export const UpdateDateFormatActionName = 'UpdateDateFormatAction';

export interface UpdateDateFormatAction extends Action {
    dateFormat: DateFormat;
}

export const updateDateFormatActionBuilder = (dateFormat: DateFormat): UpdateDateFormatAction => {
    return {
        type: UpdateDateFormatActionName,
        dateFormat
    };
};