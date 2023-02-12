package iuh.nhom7.khoa_luan_backend.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReportRequest {
    private int reportType;
    private Date fromDate;
    private Date toDate;

    //filter
    private String username; // nhân viên bán hàng - bill createBy
    private String userId; // nhân viên bán hàng
    private String serviceId; // dịch vụ
    private String customerId; // khách hàng
    private String customerProvince; // tỉnh thành khách hàng
    private String customerDistrict; // quận huyện khách hàng
    private String customerWard; // phường xã khách hàng
    private Integer customerStatus; // nhóm khách hàng
    private String promotionHeaderId; // chương trình khuyến mãi
    private String promotionType; // loại khuyến mãi
}
