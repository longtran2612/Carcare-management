package iuh.nhom7.khoa_luan_backend.request.price;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePriceRequest implements Serializable {
    private static final long serialVersionUID = 2107927616357827243L;

    private String name;
    private String type;
    private BigDecimal price;
    private String currency;
//    private int status;
}
