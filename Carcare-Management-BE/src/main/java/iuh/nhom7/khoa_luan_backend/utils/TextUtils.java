package iuh.nhom7.khoa_luan_backend.utils;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.text.Normalizer;
import java.util.regex.Pattern;

public final class TextUtils {

    public static final String DATE_ATOM_REGEX = "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\+\\d{2}:\\d{2}$";
    public static final String MAIL_REGEX = "^([_a-zA-Z0-9-]+(\\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*(\\.[a-zA-Z]{1,6}))?$";
    public static final String DATE_ATOM_PATTERN = "yyyy-MM-dd'T'HH:mm:ssX";
    public static final String TAX_REGEX = "([0-9]{10}(-[0-9]{3})*)*";

    public static String removeControlChar(String value) {
        return isNullOrEmptyString(value) ? value : value.replaceAll("\\p{Cc}", "");
    }

    public static String convertStringToSort(String value) {
        return value == null ? "" : unAccent(value).trim().toLowerCase().replaceAll(" {2,}", " ").replaceAll(" ", "-");
    }

    public static String convertStringToSearch(String value) {
        return value == null ? "" : value.toLowerCase().replaceAll("/", "");
    }

    public static String getStackTrace(final Throwable throwable) {
        StringWriter stackTrace = new StringWriter();
        PrintWriter printWriter = new PrintWriter(stackTrace, true);
        throwable.printStackTrace(printWriter);
        return stackTrace.getBuffer().toString();
    }

    public static String unAccent(String s) {
        String temp = Normalizer.normalize(s, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(temp).replaceAll("").replaceAll("Đ", "D").replace("đ", "d");
    }

    public static boolean isNullOrEmptyString(String input) {
        if (input == null || input.trim().isEmpty()) {
            return true;
        }
        return false;
    }

    public static String convert2TemplateName(String action) {
        return action == null ? "" : action.trim();
    }

    public static String removeSpecialCharacter(String source) {
        if(source == null || source.trim().length() == 0) {
            return "";
        }

        return source.replaceAll("[^a-zA-Z0-9ăâđêôơưĂÂĐÊÔƠƯ]", "");
    }
}
