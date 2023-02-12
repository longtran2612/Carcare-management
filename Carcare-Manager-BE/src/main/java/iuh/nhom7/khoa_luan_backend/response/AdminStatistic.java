package iuh.nhom7.khoa_luan_backend.response;

import lombok.*;

/**
 * 9:51 PM 21-Nov-22
 * Long Tran
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatistic {
    private Long totalServicePrice;
    private Long totalPromotionAmount;
    private Long totalPaymentAmount;
    private Integer totalBill;
    private Integer totalCancelBill;
}
