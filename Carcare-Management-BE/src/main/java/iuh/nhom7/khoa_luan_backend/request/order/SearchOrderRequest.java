package iuh.nhom7.khoa_luan_backend.request.order;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import iuh.nhom7.khoa_luan_backend.base.BasePageAndSortRequest;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SearchOrderRequest extends BasePageAndSortRequest {
    private String keyword;

    private Integer status;
    private Date fromReceiveDate;
    private Date toReceiveDate;
    private Date fromExecuteDate;
    private Date toExecuteDate;
}
