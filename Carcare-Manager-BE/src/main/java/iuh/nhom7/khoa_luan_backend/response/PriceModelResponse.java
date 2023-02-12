package iuh.nhom7.khoa_luan_backend.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class PriceModelResponse {
    private BigDecimal price;
    private String currency;
    private Object effectiveDate;
    private Object expirationDate;
    private String priceCode;
}
