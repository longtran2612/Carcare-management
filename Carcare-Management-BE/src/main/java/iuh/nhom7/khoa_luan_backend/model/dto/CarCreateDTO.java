package iuh.nhom7.khoa_luan_backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 9:14 PM 20-Sep-22
 * Long Tran
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CarCreateDTO {
    private String name;
    private String color;
    private String licensePlate;
    private String description;
    private String userId;
    private String carModelId;
    private String imageUrl;
}
