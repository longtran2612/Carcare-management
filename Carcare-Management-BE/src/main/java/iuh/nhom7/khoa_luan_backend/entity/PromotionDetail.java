package iuh.nhom7.khoa_luan_backend.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "promotion_details")
public class PromotionDetail {
    @Id
    private String id;
    private String promotionDetailCode;
    private String description;
    private String type; //percentage, money
    private BigDecimal amount;
    private BigDecimal maximumDiscount; //money

    // promo conditions
    private BigDecimal minimumSpend;
    private List<String> categoryIds; // danh sách danh mục dịch vụ
    private Integer customerType; // loại hay status của customer
    private List<String> serviceIds; // danh sách danh mục dịch vụ

    private String promotionLineId;
    @Builder.Default
    private Boolean limitUsedTime = Boolean.FALSE; // promotion có hạn chế số lần sử dụng
    @Builder.Default
    private BigDecimal limitPromotionAmount = BigDecimal.valueOf(0); // hạn mức khuyến mãi
    private Integer promotionUsedTime; // số lần đã khuyến mãi
    @Builder.Default
    private Double promotionUsedAmount = 0D; // số tiền đã khuyến mãi

    private String status;
    private Date createDate;
    private String createBy;
    private Date updateDate;
    private String updateBy;
}
