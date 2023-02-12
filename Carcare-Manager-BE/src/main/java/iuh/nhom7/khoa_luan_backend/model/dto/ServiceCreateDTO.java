package iuh.nhom7.khoa_luan_backend.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import iuh.nhom7.khoa_luan_backend.model.PriceModel;
import lombok.*;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;

/**
 * 9:06 PM 15-Sep-22
 * Long Tran
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ServiceCreateDTO {

    @NotEmpty(message = "name empty")
    private String name;
    private String type;
    private String description;
    private double estimateTime;
    private String createBy;
    private String categoryId;
    private String imageUrl;

//    @Valid
//    private PriceModel servicePrice;
}
