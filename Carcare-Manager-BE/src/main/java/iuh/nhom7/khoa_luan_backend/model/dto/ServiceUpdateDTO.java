package iuh.nhom7.khoa_luan_backend.model.dto;

import iuh.nhom7.khoa_luan_backend.model.PriceModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;

/**
 * 8:42 AM 21-Sep-22
 * Long Tran
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ServiceUpdateDTO {
    private String type;
    private String name;
    private String description;
    private double estimateTime;
    private String categoryId;
    private String imageUrl;

//    @Valid
//    private PriceModel servicePrice;
}
