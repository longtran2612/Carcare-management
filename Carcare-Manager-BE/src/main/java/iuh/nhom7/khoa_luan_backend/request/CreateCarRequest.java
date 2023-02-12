package iuh.nhom7.khoa_luan_backend.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreateCarRequest {
    private String name;
    private String color;
    private String licensePlate;
    private String customerId;
    private String carModel;
}
