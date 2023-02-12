package iuh.nhom7.khoa_luan_backend.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreatePriceHeaderRequest {
    private String name;
    private String description;
    private Date effectiveDate;
    private Date expirationDate;
}
