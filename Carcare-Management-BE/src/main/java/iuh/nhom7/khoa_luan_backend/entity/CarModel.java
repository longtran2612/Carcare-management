package iuh.nhom7.khoa_luan_backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 * 4:40 PM 20-Sep-22
 * Long Tran
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "car_model")
@Builder
public class CarModel {
    @Id
    private String id;
    private String carModelCode;
    private String brand;
    private String model;
    private String engine;
    private String transmission;
    private Long seats;
    private String fuel;
    private Long year;

    private Date createDate;
    private String createBy;
    private Date updateDate;
    private String updateBy;

}
