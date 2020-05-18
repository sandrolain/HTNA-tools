// TODO: docs
export type Day = Date | string | [number, number, number];

// TODO: docs
export type Time = Date | string | number | [number, number, number, number];

// TODO: test
// TODO: docs
export const TIME_REGEXP = /^([0-2][0-9]):([0-5][0-9])(?::([0-5][0-9])(?:\.([0-9]+))?)?$/;

// TODO: test
// TODO: docs
export const DATE_REGEXP = /^([0-9]{4})-(0[1-9]|1[0-2])-([0-2][0-9]|3[0-1])$/;

// TODO: test
// TODO: docs
export function isTimeString (time: string): boolean {
  return !!time.match(TIME_REGEXP);
}

// TODO: test
// TODO: docs
export function parseTime (time: Time): [number, number, number, number] {
  let hours   = 0;
  let minutes = 0;
  let seconds = 0;
  let millis  = 0;
  if(time instanceof Date) {
    hours   = time.getHours();
    minutes = time.getMinutes();
    seconds = time.getSeconds();
    millis  = time.getMilliseconds();
  } else if(time instanceof Array) {
    hours   = time[0] || 0;
    minutes = time[1] || 0;
    seconds = time[2] || 0;
    millis  = time[3] || 0;
  } else if(typeof time === "number") {
    millis = time % 1000;
    time    = Math.floor(time / 1000);
    seconds = time % 60;
    time    = Math.floor(time / 60);
    minutes = time % 60;
    hours   = Math.floor(time / 60);
  } else if(typeof time === "string") {
    const match = time.match(TIME_REGEXP);
    if(match) {
      hours   = parseInt(match[1] || "0", 10);
      minutes = parseInt(match[2] || "0", 10);
      seconds = parseInt(match[3] || "0", 10);
      millis  = parseInt(match[4] || "0", 10);
    }
  }
  return [hours, minutes, seconds, millis];
}

// TODO: test
// TODO: docs
export function timeFrom (source: Time): Date {
  const [hours, minutes, seconds, millis] = parseTime(source);
  const date = new Date();
  if(hours > 0 || minutes > 0 || seconds > 0 || millis > 0) {
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    date.setMilliseconds(millis);
  }
  return date;
}

// TODO: test
// TODO: docs
export function setTime (date: Date, time: Time): Date {
  const [hours, minutes, seconds, millis] = parseTime(time);
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);
  date.setMilliseconds(millis);
  return date;
}

// TODO: test
// TODO: docs
export function modTime (date: Date, time: Time): Date {
  const [hours, minutes, seconds, millis] = parseTime(time);
  date.setHours(date.getHours() + hours);
  date.setMinutes(date.getMinutes() + minutes);
  date.setSeconds(date.getSeconds() + seconds);
  date.setMilliseconds(date.getMilliseconds() + millis);
  return date;
}

// TODO: test
// TODO: docs
export function startOfDay (date: Date): Date {
  return setTime(date, [0, 0, 0, 0]);
}

// TODO: test
// TODO: docs
export function endOfDay (date: Date): Date {
  return setTime(date, [23, 59, 59, 999]);
}

// TODO: test
// TODO: docs
export function minDate (...dates: Date[]): Date {
  return new Date(dates.sort((a, b) => (a.getTime() - b.getTime())).shift().getTime());
}

// TODO: test
// TODO: docs
export function maxDate (...dates: Date[]): Date {
  return new Date(dates.sort((a, b) => (a.getTime() - b.getTime())).pop().getTime());
}

// TODO: test
// TODO: docs
export function boundDate (date: Date, minDate: Date, maxDate: Date): Date {
  if(date.getTime() < minDate.getTime()) {
    return new Date(minDate.getTime());
  }
  if(date.getTime() > maxDate.getTime()) {
    return new Date(maxDate.getTime());
  }
  return new Date(date);
}

// TODO: test
// TODO: docs
export function parseDate (day: Day): [number, number, number] {
  let year  = 0;
  let month = 0;
  let date  = 0;
  if(day instanceof Date) {
    year  = day.getFullYear();
    month = day.getMonth();
    date  = day.getDate();
  } else if(day instanceof Array) {
    year  = day[0] || 0;
    month = day[1] || 0;
    date  = day[2] || 0;
  } else if(typeof day === "string") {
    const match = day.match(DATE_REGEXP);
    if(match) {
      year  = parseInt(match[1] || "0", 10);
      month = parseInt(match[2] || "0", 10);
      date  = parseInt(match[3] || "0", 10);
    }
  }
  return [year, month, date];
}


// TODO: test
// TODO: docs
export function dateFrom (source: Day): Date {
  const [year, month, day] = parseDate(source);
  const date = new Date();
  if(year > 0 || month > 0 || day > 0) {
    date.setFullYear(year);
    date.setMonth(month - 1);
    date.setDate(day);
  }
  return date;
}

// TODO: test
// TODO: docs
export function setDate (date: Date, source: Day): Date {
  const [year, month, day] = parseDate(source);
  date.setFullYear(year);
  date.setMonth(month - 1);
  date.setDate(day);
  return date;
}


// TODO: test
/**
 * Modify a Date instance by adding or subtracting years and / or months and / or days according to the argument *mod*
 * @param date The Date instance to be modified
 * @param mod The type change value {@link Day}
 */
export function addDate (date: Date, mod: Day): Date {
  const [year, month, day] = parseDate(mod);
  date.setFullYear(date.getFullYear() + year);
  date.setMonth(date.getMonth() + month);
  date.setDate(date.getDate() + day);
  return date;
}

// TODO: test
// TODO: docs
export function dateString (date: Date): string {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

// TODO: test
// TODO: docs
export function timeString (date: Date, seconds: boolean = false, millis: boolean = false): string {
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}${
    seconds ? `:${date.getSeconds().toString().padStart(2, "0")}${
      millis ? `.${date.getMilliseconds().toString().padStart(9, "0")}` : ""}` : ""}`;
}
