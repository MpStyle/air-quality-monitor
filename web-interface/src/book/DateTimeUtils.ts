export const epochToFormatedDate = (ms: number) => {
    const date = new Date(ms);
    const d = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    const offset = date.getTimezoneOffset() / 60;
    const hours = date.getHours();

    d.setHours(hours - offset);

    const date_format_str = d.getFullYear().toString() + "-" + ((d.getMonth() + 1).toString().length === 2 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1).toString()) + "-" + (d.getDate().toString().length === 2 ? d.getDate().toString() : "0" + d.getDate().toString()) + " " + (d.getHours().toString().length === 2 ? d.getHours().toString() : "0" + d.getHours().toString()) + ":" + ((d.getMinutes() / 5 * 5).toString().length === 2 ? ((d.getMinutes() / 5) * 5).toString() : "0" + ((d.getMinutes() / 5) * 5).toString()) + ":00";
    return date_format_str;
};