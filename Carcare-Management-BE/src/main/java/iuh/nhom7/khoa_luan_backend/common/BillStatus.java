package iuh.nhom7.khoa_luan_backend.common;

import java.util.HashMap;
import java.util.Map;

public class BillStatus {
    public static final int PENDING = 0;
    public static final int PAID = 1;
    public static final int CANCELED = 2;

    public static Map<Integer, String> mapBillStatus;

    static {
        mapBillStatus = new HashMap<>();
        mapBillStatus.put(PENDING, "Chưa thanh toán");
        mapBillStatus.put(PAID, "Đã thanh toán");
        mapBillStatus.put(CANCELED, "Đã hủy");
    }
}
