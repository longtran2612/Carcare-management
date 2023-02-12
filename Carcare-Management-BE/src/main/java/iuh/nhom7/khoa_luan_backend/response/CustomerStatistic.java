package iuh.nhom7.khoa_luan_backend.response;

import lombok.*;

/**
 * 4:11 PM 20-Nov-22
 * Long Tran
 */

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerStatistic {
    private String customerCode;
    private String customerName;
    private Long totalServicePrice;
    private Long totalPromotionAmount;
    private Long totalPaymentAmount;
    private Integer totalBill;
    private Integer totalCancelBill;
}
