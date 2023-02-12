package iuh.nhom7.khoa_luan_backend.model;

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
public class BillPromotionDetailModel {
    private String id;
    private String promotionDetailCode;
    private String description;
    private String type; //percentage, money
    private BigDecimal amount;
    private Double promotionUsedAmount; // số tiền đã khuyến mãi
}
