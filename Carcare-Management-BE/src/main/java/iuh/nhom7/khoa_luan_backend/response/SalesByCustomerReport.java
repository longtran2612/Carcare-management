package iuh.nhom7.khoa_luan_backend.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SalesByCustomerReport {
    private String customerCode;
    private String customerName;
    private String address;
    private String ward;
    private String district;
    private String province;
    private String statusName;
    private String carCode;
    private String carBrand;
    private String licensePlate;
    private Long totalServicePrice;
    private Long totalPromotionAmount;
    private Long totalPaymentAmount;
}
