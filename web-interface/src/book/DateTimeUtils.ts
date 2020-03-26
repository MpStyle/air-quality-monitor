import moment from "moment";
import { DateFormat } from "../entity/DateFormat";
import { ShortDateFormat } from "../entity/ShortDateFormat";

export class DateTimeUtils {
    static timestampToFormatedDate(ms: number, format: string): string {
        const d = DateTimeUtils.timestampToLocaleDate(ms);
        return moment(d).format(format);
    }

    static localeDateToTimestamp(ms: Date): number {
        return ms.getTime();
    }

    static timestampToLocaleDate(ms: number): Date {
        return new Date(ms);
    }

    static timestampToDate(ms: number, format: DateFormat): string {
        switch (format) {
            case DateFormat.DD_MINUS_MM_MINUS_YYYY: return DateTimeUtils.timestampToFormatedDate(ms, 'DD-MM-YYYY');
            case DateFormat.DD_SLASH_MM_SLASH_YYYY: return DateTimeUtils.timestampToFormatedDate(ms, 'DD/MM/YYYY');
            case DateFormat.MM_SLASH_DD_SLASH_YYYY: return DateTimeUtils.timestampToFormatedDate(ms, 'MM/DD/YYYY');
            case DateFormat.MM_MINUS_DD_MINUS_YYYY: return DateTimeUtils.timestampToFormatedDate(ms, 'MM-DD-YYYY');
            case DateFormat.MMMM_SPACE_DO_SPACE_YYYY: return DateTimeUtils.timestampToFormatedDate(ms, 'MMMM Do YYYY');
            case DateFormat.MMM_SPACE_DO_SPACE_YY: return DateTimeUtils.timestampToFormatedDate(ms, 'MMM Do YY');
            case DateFormat.YYYY_MINUS_MM_MINUS_DD: return DateTimeUtils.timestampToFormatedDate(ms, 'YYYY-MM-DD');
            case DateFormat.YYYY_SLASH_MM_SLASH_DD: return DateTimeUtils.timestampToFormatedDate(ms, 'YYYY/MM/DD');
        }
    }

    static timestampToShortDate(ms: number, format: ShortDateFormat): string {
        switch (format) {
            case ShortDateFormat.MMMM_SPACE_YYYY: return DateTimeUtils.timestampToFormatedDate(ms, 'MMMM YYYY');
            case ShortDateFormat.MMM_SPACE_YY: return DateTimeUtils.timestampToFormatedDate(ms, 'MMM YY');
            case ShortDateFormat.MM_MINUS_YYYY: return DateTimeUtils.timestampToFormatedDate(ms, 'MM-YYYY');
            case ShortDateFormat.MM_SLASH_YYYY: return DateTimeUtils.timestampToFormatedDate(ms, 'MM/YYYY');
            case ShortDateFormat.YYYY_MINUS_MM: return DateTimeUtils.timestampToFormatedDate(ms, 'YYYY-MM');
            case ShortDateFormat.YYYY_SLASH_MM: return DateTimeUtils.timestampToFormatedDate(ms, 'YYYY/MM');
        }
    }
}