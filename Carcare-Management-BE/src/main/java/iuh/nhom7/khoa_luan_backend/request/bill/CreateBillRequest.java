package iuh.nhom7.khoa_luan_backend.request.bill;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreateBillRequest {
    private String orderId;

    private List<String> promotionCodes;

    private BigDecimal totalPromotionAmount;
    private BigDecimal paymentAmount;

    private String paymentType;
    private String cardNumber;
}
