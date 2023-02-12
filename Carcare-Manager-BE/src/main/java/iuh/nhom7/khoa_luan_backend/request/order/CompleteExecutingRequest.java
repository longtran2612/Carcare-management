package iuh.nhom7.khoa_luan_backend.request.order;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CompleteExecutingRequest {
    private String orderId;
    private String carSlotId;
}
