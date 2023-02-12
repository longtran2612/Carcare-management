package iuh.nhom7.khoa_luan_backend.request.order;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class UpdateOrderRequest {
    private String customerId;
    private String carId;
    private String executorId;

    private List<String> serviceIds;

    private Date receiveDate; //ngày nhận xe
    private Date executeDate; //ngày xử lý dự kiến
}
