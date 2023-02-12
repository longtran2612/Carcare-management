package iuh.nhom7.khoa_luan_backend.utils;

import lombok.SneakyThrows;
import org.apache.commons.lang3.StringUtils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAccessor;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.IntStream;

public final class DateTimesUtils {

    public static final String DATE_FORMAT_YYYYMMDD = "yyyy-MM-dd";
    public static final String DATE_FORMAT_DD_MM_YYYY_HH_MM_SS = "dd-MM-yyyy HH:mm:ss";
    public static final String DATE_FORMAT_DDMMYYYY = "dd-MM-yyyy";
    public static final String DATE_FORMAT_ISO = "yyyy-MM-dd'T'HH:mm:ssXXX";
    public static final String DATE_FORMAT_ISO_MILLISECOND = "yyyy-MM-dd'T'HH:mm:ss.SSSSX";
    public static final SimpleDateFormat dateIsoFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX");
    public static final SimpleDateFormat dateIsoFormatWithMillisecond = new SimpleDateFormat(DATE_FORMAT_ISO_MILLISECOND);
    public static final String TYPE_OF_DATE = "DATE";
    public static final String TYPE_OF_SECOND = "SECOND";
    public static final int[] WORKING_DAYS = new int[]{Calendar.MONDAY, Calendar.TUESDAY, Calendar.WEDNESDAY, Calendar.THURSDAY, Calendar.FRIDAY};
    private static SimpleDateFormat dateVersionFormat = new SimpleDateFormat("yyyyMMdd");

    public final static String SECOND = "second";
    public final static String MINUTE = "minute";
    public final static String HOURLY = "hourly";
    public final static String DAILY = "daily";
    public final static String MONTHLY = "monthly";
    public final static String YEARLY = "yearly";

    private DateTimesUtils() {
    }

    //    public static Date nextNowByMinutes(int minutes) {
//        DateTime now = DateTime.now();
//        DateTime next = now.plusMinutes(minutes);
//        Date date = next.toDate();
//        return date;
//    }
    public static int calculateDateVersion(Date date) {
        if (date == null) {
            return 0;
        }

        return Integer.parseInt(dateVersionFormat.format(date));
    }

    public static Date convertIntToDate(int date) {
        int year = date / 10000;
        int month = (date - year * 10000) / 100;
        int day = date - year * 10000 - month * 100;
        Calendar cal = Calendar.getInstance();
        cal.set(year, month - 1, day);
        return cal.getTime();
    }

    public static String convertDateToDDMMYYYYHHMMSS(Date date) {
        if (date == null) {
            return StringUtils.EMPTY;
        }
        return new SimpleDateFormat(DATE_FORMAT_DD_MM_YYYY_HH_MM_SS).format(date);
    }

    public static String convertDateToDDMMYYYY(Date date) {
        if (date == null) {
            return StringUtils.EMPTY;
        }
        return new SimpleDateFormat(DATE_FORMAT_DDMMYYYY).format(date);
    }

    public static String convertDateToString(Date date, String pattern) {
        if (date == null) {
            return StringUtils.EMPTY;
        }
        return new SimpleDateFormat(pattern).format(date);
    }

    public static Date convertStringToDate(String dateStr, String pattern) {
        DateFormat df = new SimpleDateFormat(pattern);
        try {
            Date startDate = df.parse(dateStr);
            return startDate;
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static Date getDateBefore(Date date) {
        if (date == null) {
            return null;
        }

        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.add(Calendar.DATE, -1);
        return c.getTime();
    }

    public static Date addYear(Date date, int amount) {
        if (date == null) {
            return null;
        }

        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.add(Calendar.YEAR, amount);
        return c.getTime();
    }

    public static Date addMonth(Date date, int amount) {
        if (date == null) {
            return null;
        }

        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.add(Calendar.MONTH, amount);
        return c.getTime();
    }

    public static Date addDate(Date date, int amount) {
        if (date == null) {
            return null;
        }

        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.add(Calendar.DATE, amount);
        return c.getTime();
    }

    public static Date addMinute(Date date, int amount) {
        if (date == null) {
            return null;
        }

        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.add(Calendar.MINUTE, amount);
        return c.getTime();
    }

    public static Date addSeconds(Date date, int amount) {
        if (date == null) {
            return null;
        }

        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.add(Calendar.SECOND, amount);
        return c.getTime();
    }

    public static Date setDateNotTime(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);

        Date d = cal.getTime();

        return d;
    }

    public static Date setDateEndDay(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);

        Date d = cal.getTime();

        return d;
    }

    public static Date atStartOfDay(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }
    public static Date atEndOfDay(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }

    public static LocalDateTime convertToLocalDate(Date date) {
        return new java.sql.Timestamp(
                date.getTime()).toLocalDateTime();
    }

    public static Date localDateTimeToDate(LocalDateTime localDateTime) {
        return Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
    }

    public static Date getTodayStartTime() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startTime = now.with(LocalTime.MIN);
        return localDateTimeToDate(startTime);
    }

    public static Date parseIsoDate(String date) {
        try {
            return dateIsoFormat.parse(date);
        } catch (ParseException e) {
            return null;
        }
    }

    public static Date parseIsoDateIncludeMillisecond(String date) {
        try {
            return dateIsoFormat.parse(date);
        } catch (ParseException e) {
            try {
                return dateIsoFormatWithMillisecond.parse(date);
            } catch (ParseException e2) {
                return null;
            }
        }
    }

    @SneakyThrows
    public static Date parseIsoDateObject(Object object) {
        if (object instanceof Date) {
            return (Date) object;
        }
        if (object instanceof Number) {
            return new Date(((Number) object).longValue());
        }
        return javax.xml.bind.DatatypeConverter.parseDateTime(object.toString()).getTime();
    }

    public static String toIsoFormat(Date date) {
        return dateIsoFormat.format(date);
    }

    public static Date isoToDate(String val) {
        TemporalAccessor ta = DateTimeFormatter.ISO_OFFSET_DATE_TIME.parse(val);
        Instant i = Instant.from(ta);
        return Date.from(i);
    }

    public static Date getFutureDate(Date date, int amount, String type) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        switch (type) {
            case TYPE_OF_SECOND:
                c.add(Calendar.SECOND, amount);
                break;
            case TYPE_OF_DATE:
                c.add(Calendar.DATE, amount);
                break;
            default:
                break;
        }
        return c.getTime();
    }

    public static boolean isDateInRange(Date testDate, Date startDate, Date endDate) {
        return compareIgnoreTime(toCalendar(startDate), toCalendar(testDate)) <= 0
                && compareIgnoreTime(toCalendar(testDate), toCalendar(endDate)) <= 0;
    }

    public static boolean isInEffect(Date effectiveDate) {
        Date now = new Date();
        return compareIgnoreTime(toCalendar(effectiveDate), toCalendar(now)) <= 0;
    }

    public static int compareIgnoreTime(Date d1, Date d2) {
        return compareIgnoreTime(toCalendar(d1), toCalendar(d2));
    }

    public static int compareIgnoreTime(Calendar c1, Calendar c2) {
        if (c1.get(Calendar.YEAR) != c2.get(Calendar.YEAR))
            return c1.get(Calendar.YEAR) - c2.get(Calendar.YEAR);
        if (c1.get(Calendar.MONTH) != c2.get(Calendar.MONTH))
            return c1.get(Calendar.MONTH) - c2.get(Calendar.MONTH);
        return c1.get(Calendar.DAY_OF_MONTH) - c2.get(Calendar.DAY_OF_MONTH);
    }

    public static Calendar toCalendar(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        return cal;
    }

    public static long getDifferenceDays(Date d1, Date d2) {
        long diff = d2.getTime() - d1.getTime();
        return TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);
    }

    public static long getDifferenceMonths(Date start, Date end) {
        return ChronoUnit.MONTHS.between(
                YearMonth.from(convertToLocalDateViaMillisecond(start)),
                YearMonth.from(convertToLocalDateViaMillisecond(end))
        );
    }

    public static long getDateDiff(Date date1, Date date2, TimeUnit timeUnit) {
        long diffInMillies = date2.getTime() - date1.getTime();
        return timeUnit.convert(diffInMillies, TimeUnit.MILLISECONDS);
    }

    public static LocalDate convertToLocalDateViaMillisecond(Date dateToConvert) {
        return Instant.ofEpochMilli(dateToConvert.getTime())
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
    }

    public static boolean isEqual(Date date1, Date date2) {
        if (date1 == null && date2 == null)
            return true;
        if ((date1 == null && date2 != null) || (date1 != null && date2 == null))
            return false;
        return date1.compareTo(date2) == 0;
    }

    public static Date setDateTimeToZero(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return cal.getTime();
    }

    public static Date setDateTimeSecondToZero(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return cal.getTime();
    }

    public static Date setDay(Date date, int day) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.set(Calendar.DAY_OF_MONTH, day);
        return c.getTime();
    }

    public static boolean isWorkingDay(Date date) {
        if (date == null) {
            return false;
        }

        Calendar c = Calendar.getInstance();
        c.setTime(date);
        int dayOfWeek = c.get(Calendar.DAY_OF_WEEK);

        // Check holiday if any later

        return IntStream.of(WORKING_DAYS).anyMatch(workingDay -> workingDay == dayOfWeek);
    }

    public static Date addWorkingDay(Date date, int amount) {
        if (date == null || !isWorkingDay(date)) {
            return null;
        }

        int weekCount = amount / 5;
        int remainDays = amount % 5;

        int actualDays = weekCount * 7 + remainDays;

        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.add(Calendar.DATE, actualDays);

        Date result = c.getTime();
        if (!isWorkingDay(result)) {
            if (actualDays > 0) {
                // Friday to Sat (add 1 working day, actual result should be Mon) => current Sat +2 to Mon
                // Friday to Sun (add 2 working days, actual result should be Tue) => current Sun +2 to Tue
                c.add(Calendar.DATE, 2);
            } else {
                // Mon to Sat (minus 2 working days, actual result should be Thu) => current Sat -2 to Thu
                // Mon to Sun (minus 1 working day, actual result should be Fri) => current Sun -2 to Fri
                c.add(Calendar.DATE, -2);
            }

            return c.getTime();
        }

        return result;
    }

    public static String convertToUTCFormat(Date date) {
        TimeZone utc = TimeZone.getTimeZone("UTC");
        SimpleDateFormat isoFormatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX");
        isoFormatter.setTimeZone(utc);
        return isoFormatter.format(date);
    }

    public static List<Date> getDatesBetween2Dates(Date startDate, Date endDate) {
        List<Date> datesInRange = new ArrayList<>();
        Calendar calendar = getStartDateCalendarWithoutTime(startDate);
        Calendar endCalendar = getEndDateCalendarWithoutTime(endDate);

        while (calendar.before(endCalendar)) {
            Date result = calendar.getTime();
            datesInRange.add(result);
            calendar.add(Calendar.DATE, 1);
        }

        return datesInRange;
    }
    public static List<Date> getDateList(Date fromDate, Date toDate) {
        List<Date> results = new ArrayList<>();

        int dayStart = DateTimesUtils.getDay(fromDate);
        int monthStart = DateTimesUtils.getMonth(fromDate);
        int yearStart = DateTimesUtils.getYear(fromDate);
        Date start = DateTimesUtils.getDate(yearStart, monthStart, dayStart);

        int dayEnd = DateTimesUtils.getDay(toDate);
        int monthEnd = DateTimesUtils.getMonth(toDate);
        int yearEnd = DateTimesUtils.getYear(toDate);
        Date end = DateTimesUtils.getDate(yearEnd, monthEnd, dayEnd);

        while (!start.after(end)) {
            results.add(start);
            start = DateTimesUtils.getDateAfterNumberTimes(start, 1, DateTimesUtils.DAILY);
        }

        return results;
    }

    public static int getYear(Date date) {
        Calendar cal = Calendar.getInstance();
        if (null != date) {
            cal.setTimeInMillis(date.getTime());
        }
        return cal.get(Calendar.YEAR);
    }


    public static int getMonth(Date date) {
        Calendar cal = Calendar.getInstance();
        if (null != date) {
            cal.setTimeInMillis(date.getTime());
        }
        return cal.get(Calendar.MONTH) + 1;
    }

    public static int getDay(Date date) {
        Calendar cal = Calendar.getInstance();
        if (null != date) {
            cal.setTimeInMillis(date.getTime());
        }
        return cal.get(Calendar.DAY_OF_MONTH);
    }
    public static Date getDateAfterNumberTimes(Date date, int number, String type) {
        Calendar cal = Calendar.getInstance();
        if (null != date) {
            cal.setTimeInMillis(date.getTime());
        }
        if (type.equalsIgnoreCase(MINUTE)) {
            cal.add(Calendar.MINUTE, +number);
        } else if (type.equalsIgnoreCase(HOURLY)) {
            cal.add(Calendar.HOUR, +number);
        } else if (type.equalsIgnoreCase(DAILY)) {
            cal.add(Calendar.DAY_OF_YEAR, +number);
        } else if (type.equalsIgnoreCase(MONTHLY)) {
            cal.add(Calendar.MONTH, +number);
        } else if (type.equalsIgnoreCase(YEARLY)) {
            cal.add(Calendar.YEAR, +number);
        }
        return cal.getTime();
    }
    public static Date getDate(int year, int month, int day) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_MONTH, day);
        calendar.set(Calendar.MONTH, month - 1);
        calendar.set(Calendar.YEAR, year);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }

    public static Calendar getStartDateCalendarWithoutTime(Date date) {
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        calendar.add(Calendar.HOUR_OF_DAY, 7);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar;
    }

    public static Calendar getEndDateCalendarWithoutTime(Date date) {
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        calendar.add(Calendar.HOUR_OF_DAY, 7);
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MILLISECOND, 59);
        return calendar;
    }
}
