package iuh.nhom7.khoa_luan_backend.request.promotion.detail;

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
public class UpdatePromotionDetailRequest {
    private String promotionDetailCode;
    private String description;
    private String type; //percentage, money
    private BigDecimal amount;
    private BigDecimal maximumDiscount; //money

    // promo conditions
    private BigDecimal minimumSpend;
    private List<String> categoryIds;
    private Integer customerType;
    private List<String> serviceIds;

    private Boolean limitUsedTime;// promotion có hạn chế số lần sử dụng
    private BigDecimal limitPromotionAmount; // hạn mức khuyến mãi
}
