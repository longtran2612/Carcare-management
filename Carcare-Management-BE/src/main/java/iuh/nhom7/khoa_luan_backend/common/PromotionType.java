package iuh.nhom7.khoa_luan_backend.common;

import java.util.HashMap;
import java.util.Map;

public class PromotionType {
    public static final String PERCENTAGE = "PERCENTAGE";
    public static final String MONEY = "MONEY";
    public static final String SERVICE = "SERVICE";

    public static Map<String, String> mapPromotionType;

    static {
        mapPromotionType = new HashMap<>();
        mapPromotionType.put(PERCENTAGE, "Giảm theo %");
        mapPromotionType.put(MONEY, "Giảm tiền");
        mapPromotionType.put(SERVICE, "Giảm giá dịch vụ");
    }
}
