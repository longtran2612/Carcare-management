package iuh.nhom7.khoa_luan_backend.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.util.Date;

/**
 * 6:03 PM 20-Nov-22
 * Long Tran
 */

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class StatisticRequest {
    private Date fromDate;
    private Date toDate;
    private String userId; // nhân viên bán hàng


}
