package iuh.nhom7.khoa_luan_backend.common;

import java.util.HashMap;
import java.util.Map;

public class CustomerStatus {
    public static final int OPPORTUNITY = 0;
    public static final int NORMAL = 1;
    public static final int VIP = 2;
    public static final int BLACKLISTED = -1;
    public static final int DELETED = -2;

    public static Map<Integer, String> mapCustomerStatus;

    static {
        mapCustomerStatus = new HashMap<>();
        mapCustomerStatus.put(OPPORTUNITY, "Tiềm năng");
        mapCustomerStatus.put(NORMAL, "Thông thường");
        mapCustomerStatus.put(VIP, "VIP");
        mapCustomerStatus.put(BLACKLISTED, "Blacklist");
        mapCustomerStatus.put(DELETED, "Đã xóa");
    }
}
