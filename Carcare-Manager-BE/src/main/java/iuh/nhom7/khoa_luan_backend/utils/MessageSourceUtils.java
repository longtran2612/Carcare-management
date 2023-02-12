package iuh.nhom7.khoa_luan_backend.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Locale;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class MessageSourceUtils {

    private static MessageSource messageSource;
    private static Locale localeVN = new Locale("vi", "VN");
    @Autowired
    public void setMessageSource(MessageSource messageSource) {
        MessageSourceUtils.messageSource = messageSource;
    }

    public static String getMessage(String key, Object... args) {
        try {
//            Locale.setDefault(new Locale("vi", "VN"));
            return messageSource.getMessage(key, args, localeVN);
        } catch (Exception ex) {
            return key;
        }
    }

    public static String getMessageCombine(String key, Function<String, String> funcExtendMsg, Object... args) {
        try {
            String sFirst = messageSource.getMessage(key, args, localeVN);
            return sFirst + "(#)" + funcExtendMsg.apply("($)");
        } catch (Exception ex) {
            return key;
        }
    }

    public static String getMessagePermissions(String key, Object... args) {
        try {
            if (key.indexOf(",") > -1) {
                String msg = Arrays.asList(key.split(",")).stream().map(s -> getMessage("PERMISSION." + s, args, localeVN)).collect(Collectors.joining(", "));
                return getMessage("PERMISSION_LIST", msg, localeVN);
            } else {
                String prefix = getMessage("PERMISSION_ONE", args, localeVN);
                if ("PERMISSION_ONE".equals(prefix))
                    return getMessage("PERMISSION." + key, args, localeVN);
                else if (key.startsWith("ERROR."))
                    return getMessage("PERMISSION_ERROR", getMessage("PERMISSION." + key, args, localeVN), localeVN);
                else
                    return getMessage("PERMISSION_ONE", getMessage("PERMISSION." + key, args, localeVN), localeVN);
            }
        } catch (Exception ex) {
            return key;
        }
    }
}
