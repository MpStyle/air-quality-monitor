import { StringUtils } from "./StringUtils";

export const epochToFormatedDate = (ms: number): string => {
    const d = epochToLocaleDate(ms);
    const date_format_str = d.getFullYear().toString()
        + "-"
        + StringUtils.padLeft(d.getMonth() + 1, '0', 2)
        + "-"
        + StringUtils.padLeft(d.getDate(), '0', 2)
        + " "
        + StringUtils.padLeft(d.getHours(), '0', 2)
        + ":"
        + StringUtils.padLeft(d.getMinutes(), '0', 2)
        + ":"
        + StringUtils.padLeft(d.getSeconds(), '0', 2);
    return date_format_str;
};

export const epochToLocaleDate = (ms: number): Date => {
    return new Date(ms);
};

export const weekDayNames = (): string[] => {
    const weekday = [];
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    return weekday;
};

export const monthNames = (): string[] => {
    const month = [];
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";

    return month;
};