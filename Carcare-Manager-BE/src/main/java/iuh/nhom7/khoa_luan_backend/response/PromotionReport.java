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
public class PromotionReport {
    private String promotionDetailCode;
    private String promotionDetailName;
    private Date fromDate;
    private Date toDate;
    private String promotionType;
    private String serviceCode;
    private String serviceName;
    private BigDecimal promotionAmount;
    private String limitUsedTime;
    private BigDecimal limitPromotionAmount;
    private Long limitPromotionAmountLeft;
    private Double promotionUsedAmount;
}
