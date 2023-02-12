package iuh.nhom7.khoa_luan_backend.entity;

import iuh.nhom7.khoa_luan_backend.common.OrderStatus;
import iuh.nhom7.khoa_luan_backend.model.profile.ServiceProfile;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document("orders")
public class Order {
    @Id
    private String id;
    @Indexed
    private String orderCode;

    @Indexed
    private String customerId; //khách hàng
    private String customerCode;
    private String customerName;
    private String customerPhoneNumber;

    @Indexed
    private String carId;
    private String carCode;
    private String carName;
    private String carLicensePlate;

    @Indexed
    private String executorId; //nhân viên
    private String executorCode;
    private String executorName;
    private String executorPhoneNumber;

    private List<CarCareService> services;
    private double totalEstimateTime;
    private double totalExecuteTime;
    private BigDecimal totalServicePrice;

    private Date estimateReceiveDate; //ngày nhận xe dự kiến
    private Date estimateExecuteDate; //ngày xử lý dự kiến

    private Date carReceivedDate; //ngày nhận xe thực tế
    private Date carExecutingDate; //ngày chăm sóc xe thực tế
    private Date carExecutedDate; //ngày hoàn thành chăm sóc thực tế
    private Date orderCanceledDate; //ngày hủy yêu cầu
    private Date paymentDate; //ngày thanh toán yêu cầu

    // workflow
    @Builder.Default
    private int status = OrderStatus.PENDING;
    private String statusName;
    private Date createDate;
    private String createBy;
    private Date updateDate;
    private String updateBy;

    private Set<String> searchingKeys;
}
