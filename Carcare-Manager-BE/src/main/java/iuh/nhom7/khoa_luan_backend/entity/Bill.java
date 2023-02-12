package iuh.nhom7.khoa_luan_backend.entity;

import iuh.nhom7.khoa_luan_backend.common.BillStatus;
import iuh.nhom7.khoa_luan_backend.model.BillPromotionDetailModel;
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
@Document(collection = "bills")
public class Bill {
    @Id
    private String id;
    private String billCode;
    private Date canceledDate;
    private String canceledByUserId;
    private String canceledByUserCode;
    private String canceledByUserName;

    @Indexed
    private String orderId;
    private String orderCode;

    private String customerId; //khách hàng
    private String customerCode;
    private String customerName;
    private String customerPhoneNumber;

    private String carId;
    private String carCode;
    private String carName;
    private String carLicensePlate;

    private String executorId; //nhân viên
    private String executorCode;
    private String executorName;
    private String executorPhoneNumber;

    private List<CarCareService> services;

    private List<BillPromotionDetailModel> promotionDetails;

    private BigDecimal totalServicePrice;
    private BigDecimal totalPromotionAmount;
    private BigDecimal paymentAmount;
    private Date paymentDate;
    private String paymentType;
    private String cardNumber;

    @Builder.Default
    private int status = BillStatus.PENDING;
    private String statusName;
    private Date createDate;
    private String createBy;
    private Date updateDate;
    private String updateBy;

    private Set<String> searchingKeys;
}
