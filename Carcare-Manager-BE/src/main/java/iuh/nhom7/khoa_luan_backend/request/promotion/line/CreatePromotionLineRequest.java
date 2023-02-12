package iuh.nhom7.khoa_luan_backend.request.promotion.line;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreatePromotionLineRequest {
    private String promotionLineCode;
    private String description;
    private String type;
    private Date fromDate;
    private Date toDate;

    private String promotionHeaderId;


    /// promotion detail
    private String promotionDetailCode;
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
