import { TIME_REGEXP, DATE_REGEXP, isTimeString, isDateString, parseTime, parseDate, timeFrom, setTime, modTime, millisOfTheDay } from "./date";

describe("date", () => {

  test("TIME_REGEXP valid", async () => {
    const match1 = "01:02:03.004".match(TIME_REGEXP);
    expect(match1).not.toBeNull();
    expect(match1).toEqual(expect.arrayContaining(["01:02:03.004", "01", "02", "03", "004"]));

    const match2 = "01:02:03".match(TIME_REGEXP);
    expect(match2).not.toBeNull();
    expect(match2).toEqual(expect.arrayContaining(["01:02:03", "01", "02", "03", undefined]));

    const match3 = "01:02".match(TIME_REGEXP);
    expect(match3).not.toBeNull();
    expect(match3).toEqual(expect.arrayContaining(["01:02", "01", "02", undefined, undefined]));
  });

  test("TIME_REGEXP invalid", async () => {
    const match1 = "1:02:03.004".match(TIME_REGEXP);
    expect(match1).toBeNull();

    const match2 = "01:2:03.004".match(TIME_REGEXP);
    expect(match2).toBeNull();

    const match3 = "01:02:3.004".match(TIME_REGEXP);
    expect(match3).toBeNull();

    const match4 = "01:02:03.04".match(TIME_REGEXP);
    expect(match4).toBeNull();

    const match5 = "01:0".match(TIME_REGEXP);
    expect(match5).toBeNull();
  });

  test("DATE_REGEXP valid", async () => {
    const match1 = "2020-01-01".match(DATE_REGEXP);
    expect(match1).not.toBeNull();
    expect(match1).toEqual(expect.arrayContaining(["2020-01-01", "2020", "01", "01"]));

    const match2 = "2020-12-31".match(DATE_REGEXP);
    expect(match2).not.toBeNull();
    expect(match2).toEqual(expect.arrayContaining(["2020-12-31", "2020", "12", "31"]));
  });

  test("DATE_REGEXP invalid", async () => {
    const match1 = "202-01-01".match(DATE_REGEXP);
    expect(match1).toBeNull();

    const match2 = "2020-1-01".match(DATE_REGEXP);
    expect(match2).toBeNull();

    const match3 = "2020-01-1".match(DATE_REGEXP);
    expect(match3).toBeNull();
  });

  test("isTimeString()", async () => {
    expect(isTimeString("18:15:30.123")).toBeTruthy();
    expect(isTimeString("18:15:30")).toBeTruthy();
    expect(isTimeString("18:15")).toBeTruthy();
    expect(isTimeString("24:15:30.123")).toBeFalsy();
    expect(isTimeString("18:60:30.123")).toBeFalsy();
    expect(isTimeString("18:15:60.123")).toBeFalsy();
    expect(isTimeString("18:15:30.12")).toBeFalsy();
  });

  test("isDateString()", async () => {
    expect(isDateString("2020-01-01")).toBeTruthy();
    expect(isDateString("0000-01-01")).toBeTruthy();
    expect(isDateString("9999-12-31")).toBeTruthy();
    expect(isDateString("2020-00-01")).toBeFalsy();
    expect(isDateString("2020-01-00")).toBeFalsy();
    expect(isDateString("2020-13-31")).toBeFalsy();
    expect(isDateString("2020-12-32")).toBeFalsy();
  });

  test("parseTime() as String", async () => {
    expect(parseTime("18:15:30.123")).toEqual([18, 15, 30, 123]);
    expect(parseTime("18:15:30")).toEqual([18, 15, 30, 0]);
    expect(parseTime("18:15")).toEqual([18, 15, 0, 0]);
  });

  test("parseTime() as Date", async () => {
    const date = new Date();
    date.setHours(18);
    date.setMinutes(15);
    date.setSeconds(30);
    date.setMilliseconds(123);
    expect(parseTime(date)).toEqual([18, 15, 30, 123]);
  });

  test("parseTime() as Array", async () => {
    expect(parseTime([18, 15, 30, 123])).toEqual([18, 15, 30, 123]);
  });

  test("parseTime() as Number", async () => {
    const sod = (18 * 3600000) + (15 * 60000) + (30 * 1000) + 123;
    expect(parseTime(sod)).toEqual([18, 15, 30, 123]);
  });

  test("parseDate() as String", async () => {
    expect(parseDate("2020-01-01")).toEqual([2020, 1, 1]);
  });

  test("parseDate() as Array", async () => {
    expect(parseDate([2020, 1, 1])).toEqual([2020, 1, 1]);
  });

  test("parseDate() as Date", async () => {
    const date = new Date();
    date.setFullYear(2020);
    date.setMonth(0);
    date.setDate(1);
    expect(parseDate(date)).toEqual([2020, 1, 1]);
  });

  test("timeFrom() as String", async () => {
    const res = timeFrom("18:15:30.123");
    expect(res).toBeInstanceOf(Date);
    expect(res.getHours()).toEqual(18);
    expect(res.getMinutes()).toEqual(15);
    expect(res.getSeconds()).toEqual(30);
    expect(res.getMilliseconds()).toEqual(123);
  });

  test("timeFrom() as Array", async () => {
    const res = timeFrom([18, 15, 30, 123]);
    expect(res).toBeInstanceOf(Date);
    expect(res.getHours()).toEqual(18);
    expect(res.getMinutes()).toEqual(15);
    expect(res.getSeconds()).toEqual(30);
    expect(res.getMilliseconds()).toEqual(123);
  });

  test("timeFrom() as Date", async () => {
    const date = new Date();
    date.setHours(18);
    date.setMinutes(15);
    date.setSeconds(30);
    date.setMilliseconds(123);

    const res = timeFrom(date);
    expect(res).toBeInstanceOf(Date);
    expect(res.getHours()).toEqual(18);
    expect(res.getMinutes()).toEqual(15);
    expect(res.getSeconds()).toEqual(30);
    expect(res.getMilliseconds()).toEqual(123);
  });

  test("setTime() from Date", async () => {
    const now = new Date();
    const date = new Date();
    date.setHours(18);
    date.setMinutes(15);
    date.setSeconds(30);
    date.setMilliseconds(123);

    const res = setTime(now, date);

    expect(res).toBeInstanceOf(Date);
    expect(res.getFullYear()).toEqual(now.getFullYear());
    expect(res.getMonth()).toEqual(now.getMonth());
    expect(res.getDate()).toEqual(now.getDate());
    expect(res.getHours()).toEqual(18);
    expect(res.getMinutes()).toEqual(15);
    expect(res.getSeconds()).toEqual(30);
    expect(res.getMilliseconds()).toEqual(123);
  });

  test("setTime() from String", async () => {
    const now = new Date();

    const res = setTime(now, "18:15:30.123");

    expect(res).toBeInstanceOf(Date);
    expect(res.getFullYear()).toEqual(now.getFullYear());
    expect(res.getMonth()).toEqual(now.getMonth());
    expect(res.getDate()).toEqual(now.getDate());
    expect(res.getHours()).toEqual(18);
    expect(res.getMinutes()).toEqual(15);
    expect(res.getSeconds()).toEqual(30);
    expect(res.getMilliseconds()).toEqual(123);
  });

  test("setTime() from Array", async () => {
    const now = new Date();

    const res = setTime(now, [18, 15, 30, 123]);

    expect(res).toBeInstanceOf(Date);
    expect(res.getFullYear()).toEqual(now.getFullYear());
    expect(res.getMonth()).toEqual(now.getMonth());
    expect(res.getDate()).toEqual(now.getDate());
    expect(res.getHours()).toEqual(18);
    expect(res.getMinutes()).toEqual(15);
    expect(res.getSeconds()).toEqual(30);
    expect(res.getMilliseconds()).toEqual(123);
  });

  test("modTime() from Array", async () => {
    const date = new Date();
    date.setFullYear(2020);
    date.setMonth(4);
    date.setDate(20);
    date.setHours(18);
    date.setMinutes(15);
    date.setSeconds(30);
    date.setMilliseconds(123);

    const res = modTime(date, [1, -1, 1, -1]);

    expect(res).toBeInstanceOf(Date);
    expect(res.getFullYear()).toEqual(date.getFullYear());
    expect(res.getMonth()).toEqual(date.getMonth());
    expect(res.getDate()).toEqual(date.getDate());
    expect(res.getHours()).toEqual(19);
    expect(res.getMinutes()).toEqual(14);
    expect(res.getSeconds()).toEqual(31);
    expect(res.getMilliseconds()).toEqual(122);
  });

  test("millisOfTheDay()", async () => {
    const date = new Date();
    date.setHours(18);
    date.setMinutes(15);
    date.setSeconds(30);
    date.setMilliseconds(123);

    const res = millisOfTheDay(date);
    const millis = (18 * 3600000) + (15 * 60000) + (30 * 1000) + 123;

    expect(res).toEqual(millis);
  });


});
