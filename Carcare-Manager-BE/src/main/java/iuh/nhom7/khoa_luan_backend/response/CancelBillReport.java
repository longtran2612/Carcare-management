package iuh.nhom7.khoa_luan_backend.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CancelBillReport {
    private String billCode;
    private Date billCreatedDate;
    private Date billCanceledDate;
    private String canceledUserCode;
    private String canceledUserName;
    private String services;
    private BigDecimal totalServicePrice;
    private BigDecimal totalPromotionAmount;
    private BigDecimal paymentAmount;
}
