export const epochToFormatedDate = (ms: number): string => {
    const d = epochToDate(ms);
    const date_format_str = d.getFullYear().toString() + "-" + ((d.getMonth() + 1).toString().length === 2 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1).toString()) + "-" + (d.getDate().toString().length === 2 ? d.getDate().toString() : "0" + d.getDate().toString()) + " " + (d.getHours().toString().length === 2 ? d.getHours().toString() : "0" + d.getHours().toString()) + ":" + ((d.getMinutes() / 5 * 5).toString().length === 2 ? ((d.getMinutes() / 5) * 5).toString() : "0" + ((d.getMinutes() / 5) * 5).toString()) + ":00";
    return date_format_str;
};

export const epochToLocaleDate = (ms: number) => {
    return epochToDate(ms).toLocaleDateString(undefined, { dateStyle: "medium", timeStyle: "medium", year: "numeric" } as Intl.DateTimeFormatOptions);
};

export const epochToDate = (ms: number): Date => {
    const date = new Date(ms);
    const d = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    const offset = date.getTimezoneOffset() / 60;
    const hours = date.getHours();

    d.setHours(hours - offset);

    return d;
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
    var month = [];
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