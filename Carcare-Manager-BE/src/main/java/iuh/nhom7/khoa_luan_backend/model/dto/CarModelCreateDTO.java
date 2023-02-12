package iuh.nhom7.khoa_luan_backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 8:19 PM 20-Sep-22
 * Long Tran
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CarModelCreateDTO {
    private String carModelNumber; //import only
    private String brand;
    private String model;
    private String engine;
    private String transmission;
    private Long seats;
    private String fuel;
    private Long year;
}
