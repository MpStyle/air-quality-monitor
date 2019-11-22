import { epochToFormatedDate } from "./DateTimeUtils";

test('DateTimeUtils - epochToFormatedDate', () => {
    expect(epochToFormatedDate(1574411252000)).toEqual("2019-11-22 10:27:00");
});