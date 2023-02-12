package iuh.nhom7.khoa_luan_backend.model.dto;

import lombok.*;

import javax.validation.constraints.NotBlank;
import java.math.BigDecimal;

/**
 * 9:25 PM 16-Sep-22
 * Long Tran
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PriceCreateDTO {

    private String name;
    private String type;
    private BigDecimal price;
    private String currency;

    @NotBlank(message = "priceHeaderId blank")
    private String priceHeaderId;
    @NotBlank(message = "serviceId blank")
    private String serviceId;

}
