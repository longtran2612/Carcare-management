package iuh.nhom7.khoa_luan_backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 9:38 PM 16-Sep-22
 * Long Tran
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ServiceCategoryCreateDTO {

    private String name;

    private String type;

    private String imageUrl;
}
