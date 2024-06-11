package eu.europa.ec.leos.repository.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtils {
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm");

    public static long convertToUnixTimestamp(String dateString) throws ParseException {
        Date date = dateFormat.parse(dateString);
        return date.getTime() / 1000;
    }
}