package iuh.nhom7.khoa_luan_backend.common;

import java.util.HashMap;
import java.util.Map;

public class ReportType {
    public static final int ALL = 0;
    public static final int CANCEL_BILL_REPORT = 1;
    public static final int SALES_BY_DATE_REPORT = 2;
    public static final int SALES_BY_CUSTOMER_REPORT = 3;
    public static final int PROMOTION_REPORT = 4;

    public static Map<Integer, String> mapReportType;

    static {
        mapReportType = new HashMap<>();
        mapReportType.put(ALL, "Báo cáo tổng hợp");
        mapReportType.put(CANCEL_BILL_REPORT, "Bảng kê hủy hóa đơn");
        mapReportType.put(SALES_BY_DATE_REPORT, "Doanh số bán hàng theo ngày");
        mapReportType.put(SALES_BY_CUSTOMER_REPORT, "Doanh số theo khách hàng");
        mapReportType.put(PROMOTION_REPORT, "Tổng kết khuyến mãi");
    }
}
