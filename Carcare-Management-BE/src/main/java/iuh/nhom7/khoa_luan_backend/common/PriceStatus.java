package iuh.nhom7.khoa_luan_backend.common;

import java.util.HashMap;
import java.util.Map;

public class PriceStatus {
    public static final int PENDING = 0;
    public static final int INACTIVE = 10;
    public static final int ACTIVE = 100;
    public static final int EXPIRED = -10;
    public static final int DISABLED = -100;

    public static Map<Integer, String> mapPriceStatus;

    static {
        mapPriceStatus = new HashMap<>();
        mapPriceStatus.put(PENDING, "Chờ xử lý");
        mapPriceStatus.put(INACTIVE, "Không hoạt động");
        mapPriceStatus.put(ACTIVE, "Đang có hiệu lực");
        mapPriceStatus.put(EXPIRED, "Hết hiệu lực");
        mapPriceStatus.put(DISABLED, "Đã hủy");
    }
}
