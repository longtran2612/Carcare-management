package iuh.nhom7.khoa_luan_backend.common;

import java.util.HashMap;
import java.util.Map;

public class OrderStatus {
    public static final int PENDING = 0;
    public static final int CAR_RECEIVED = 1;
    public static final int EXECUTING = 2;
    public static final int EXECUTED = 10;
    public static final int BILL_CREATED = 100;
    public static final int DISABLED = -100;

    public static Map<Integer, String> mapOrderStatus;

    static {
        mapOrderStatus = new HashMap<>();
        mapOrderStatus.put(PENDING, "Chờ xử lý");
        mapOrderStatus.put(CAR_RECEIVED, "Đã nhận xe");
        mapOrderStatus.put(EXECUTING, "Đang xử lý");
        mapOrderStatus.put(EXECUTED, "Hoàn thành");
        mapOrderStatus.put(BILL_CREATED, "Đã xuất hóa đơn");
        mapOrderStatus.put(DISABLED, "Đã hủy");
    }
}
