package iuh.nhom7.khoa_luan_backend.request.bill;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import iuh.nhom7.khoa_luan_backend.base.BasePageAndSortRequest;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * 11:59 PM 05-Nov-22
 * Long Tran
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SearchBillRequest extends BasePageAndSortRequest {
    private String keyword;
    private Integer status;
    private Date fromPaymentDate;
    private Date toPaymentDate;
}
