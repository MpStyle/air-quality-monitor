import moment from "moment";

export class DateTimeUtils {
    static epochToFormatedDate(ms: number, format: string): string {
        const d = DateTimeUtils.epochToLocaleDate(ms);
        return moment(d).format(format);
    }

    static epochToLocaleDate(ms: number): Date {
        return new Date(ms);
    }
}