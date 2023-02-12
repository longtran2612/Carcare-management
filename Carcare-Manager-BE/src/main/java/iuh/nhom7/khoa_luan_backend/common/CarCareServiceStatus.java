package iuh.nhom7.khoa_luan_backend.common;

import java.util.HashMap;
import java.util.Map;

public class CarCareServiceStatus {
    public static final int NO_PRICE = 0;
    public static final int INACTIVE = 10;
    public static final int ACTIVE = 100;
    public static final int EXPIRED = -10;
    public static final int DISABLED = -100;

    public static Map<Integer, String> mapCarCareServiceStatus;

    static {
        mapCarCareServiceStatus = new HashMap<>();
        mapCarCareServiceStatus.put(NO_PRICE, "Chưa có giá");
        mapCarCareServiceStatus.put(INACTIVE, "Ngừng hoạt động");
        mapCarCareServiceStatus.put(ACTIVE, "Đang hoạt động");
        mapCarCareServiceStatus.put(EXPIRED, "Hết hiệu lực");
        mapCarCareServiceStatus.put(DISABLED, "Đã hủy");
    }
}
