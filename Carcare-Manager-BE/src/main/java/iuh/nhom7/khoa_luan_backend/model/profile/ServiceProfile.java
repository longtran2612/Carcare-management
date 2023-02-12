package iuh.nhom7.khoa_luan_backend.model.profile;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import iuh.nhom7.khoa_luan_backend.entity.CarCareCategory;
import iuh.nhom7.khoa_luan_backend.entity.Price;
import iuh.nhom7.khoa_luan_backend.model.PriceModel;
import lombok.*;

import java.math.BigDecimal;

/**
 * 8:43 PM 17-Sep-22
 * Long Tran
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ServiceProfile {

    private String id;
    private String serviceCode;
    private String type;
    private String name;
    private String description;
    private double estimateTime;
    private String imageUrl;

    private String categoryId;
    private String categoryCode;
    private String categoryName;

    private BigDecimal price;
    private String currency;

    private String statusName;
}
