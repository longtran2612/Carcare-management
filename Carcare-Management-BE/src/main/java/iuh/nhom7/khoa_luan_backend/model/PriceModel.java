package iuh.nhom7.khoa_luan_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class PriceModel {
    @NotEmpty(message = "price empty")
    private BigDecimal price;
    @NotEmpty(message = "currency empty")
    private String currency;
    private Date effectiveDate;
    private Date expirationDate;
    private String priceCode;
}
