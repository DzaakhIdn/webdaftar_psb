import dayjs, { OpUnitType } from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

// ----------------------------------------------------------------------

/**
 * @Docs
 * https://day.js.org/docs/en/display/format
 */

/**
 * Default timezones
 * https://day.js.org/docs/en/timezone/set-default-timezone#docsNav
 *
 */

/**
 * UTC
 * https://day.js.org/docs/en/plugin/utc
 * @install
 * import utc from 'dayjs/plugin/utc';
 * dayjs.extend(utc);
 * @usage
 * dayjs().utc().format()
 *
 */

dayjs.extend(duration);
dayjs.extend(relativeTime);

// ----------------------------------------------------------------------

export const formatPatterns = {
  dateTime: "DD MMM YYYY h:mm a", // 17 Apr 2022 12:00 am
  date: "DD MMM YYYY", // 17 Apr 2022
  time: "h:mm a", // 12:00 am
  split: {
    dateTime: "DD/MM/YYYY h:mm a", // 17/04/2022 12:00 am
    date: "DD/MM/YYYY", // 17/04/2022
  },
  paramCase: {
    dateTime: "DD-MM-YYYY h:mm a", // 17-04-2022 12:00 am
    date: "DD-MM-YYYY", // 17-04-2022
  },
};

const isValidDate = (date: string | number | Date) =>
  date !== null && date !== undefined && dayjs(date).isValid();
interface fDateTimeProps {
  date: string | number | Date;
  template?: string;
}

// ----------------------------------------------------------------------

export function today(template: string = formatPatterns.date) {
  return dayjs(new Date()).startOf("day").format(template);
}

// ----------------------------------------------------------------------

/**
 * @output 17 Apr 2022 12:00 am
 */

// ----------------------------------------------------------------------

export function fDateTime({ date, template }: fDateTimeProps) {
  if (!isValidDate(date)) {
    return "Invalid date";
  }

  return dayjs(date).format(template ?? formatPatterns.dateTime);
}

// ----------------------------------------------------------------------

/**
 * @output 17 Apr 2022
 */

// ----------------------------------------------------------------------

export function fDate({ date, template }: fDateTimeProps) {
  if (!isValidDate(date)) {
    return "Invalid date";
  }

  return dayjs(date).format(template ?? formatPatterns.date);
}

// ----------------------------------------------------------------------

/**
 * @output 12:00 am
 */

// ----------------------------------------------------------------------

export function fTime({ date, template }: fDateTimeProps) {
  if (!isValidDate(date)) {
    return "Invalid date";
  }

  return dayjs(date).format(template ?? formatPatterns.time);
}

// ----------------------------------------------------------------------

/**
 * @output 1713250100
 */

// ----------------------------------------------------------------------

export function fTimestamp(date: string | number | Date) {
  if (!isValidDate(date)) {
    return "Invalid date";
  }

  return dayjs(date).valueOf();
}

// ----------------------------------------------------------------------

/**
 * @output a few seconds, 2 years
 */

// ----------------------------------------------------------------------

export function fToNow(date: string | number | Date) {
  if (!isValidDate(date)) {
    return "Invalid date";
  }

  return dayjs(date).toNow(true);
}

// ----------------------------------------------------------------------

/**
 * @output boolean
 */

// ----------------------------------------------------------------------
interface fIsBetweenProps {
  inputDate: string | number | Date;
  startDate: string | number | Date;
  endDate: string | number | Date;
}

export function fIsBetween({ inputDate, startDate, endDate }: fIsBetweenProps) {
  if (
    !isValidDate(inputDate) ||
    !isValidDate(startDate) ||
    !isValidDate(endDate)
  ) {
    return false;
  }

  const formattedInputDate = fTimestamp(inputDate);
  const formattedStartDate = fTimestamp(startDate);
  const formattedEndDate = fTimestamp(endDate);

  if (
    formattedInputDate === "Invalid date" ||
    formattedStartDate === "Invalid date" ||
    formattedEndDate === "Invalid date"
  ) {
    return false;
  }

  return (
    formattedInputDate >= formattedStartDate &&
    formattedInputDate <= formattedEndDate
  );
}

// ----------------------------------------------------------------------

/**
 * @output boolean
 */

// ----------------------------------------------------------------------
interface fIsAfterProps {
  startDate: string | number | Date;
  endDate: string | number | Date;
}

export function fIsAfter({ startDate, endDate }: fIsAfterProps) {
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return false;
  }

  return dayjs(startDate).isAfter(endDate);
}

// ----------------------------------------------------------------------

/**
 * @output boolean
 */

// ----------------------------------------------------------------------
interface fIsSameProps {
  startDate: string | number | Date;
  endDate: string | number | Date;
  unitToCompare?: OpUnitType;
}

export function fIsSame({ startDate, endDate, unitToCompare }: fIsSameProps) {
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return false;
  }

  return dayjs(startDate).isSame(endDate, unitToCompare ?? "year");
}

/**
 * @output
 * Same day: 26 Apr 2024
 * Same month: 25 - 26 Apr 2024
 * Same month: 25 - 26 Apr 2024
 * Same year: 25 Apr - 26 May 2024
 */

// ----------------------------------------------------------------------

export function fDateRangeShortLabel(
  startDate: string | number | Date,
  endDate: string | number | Date,
  initial?: boolean
) {
  if (
    !isValidDate(startDate) ||
    !isValidDate(endDate) ||
    fIsAfter({ startDate, endDate })
  ) {
    return "Invalid date";
  }

  let label = `${fDate({ date: startDate })} - ${fDate({ date: endDate })}`;

  if (initial) {
    return label;
  }

  const isSameYear = fIsSame({ startDate, endDate, unitToCompare: "year" });
  const isSameMonth = fIsSame({ startDate, endDate, unitToCompare: "month" });
  const isSameDay = fIsSame({ startDate, endDate, unitToCompare: "day" });

  if (isSameYear && !isSameMonth) {
    label = `${fDate({ date: startDate, template: "DD MMM" })} - ${fDate({
      date: endDate,
    })}`;
  } else if (isSameYear && isSameMonth && !isSameDay) {
    label = `${fDate({ date: startDate, template: "DD" })} - ${fDate({
      date: endDate,
    })}`;
  } else if (isSameYear && isSameMonth && isSameDay) {
    label = `${fDate({ date: endDate })}`;
  }

  return label;
}

// ----------------------------------------------------------------------

export function fAdd({
  years = 0,
  months = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
}) {
  const result = dayjs()
    .add(
      dayjs.duration({
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
      })
    )
    .format();

  return result;
}

/**
 * @output 2024-05-28T05:55:31+00:00
 */

// ----------------------------------------------------------------------

export function fSub({
  years = 0,
  months = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
}) {
  const result = dayjs()
    .subtract(
      dayjs.duration({
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
      })
    )
    .format();

  return result;
}
