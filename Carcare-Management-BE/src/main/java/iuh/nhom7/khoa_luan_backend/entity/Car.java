package iuh.nhom7.khoa_luan_backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 * 4:36 PM 20-Sep-22
 * Long Tran
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Document
@Builder
public class Car {

    @Id
    private String id;
    @Indexed
    private String carCode;
    private String name;
    private String color;
    private String licensePlate;
    private String description;
    private String brand;
    private String model;
    private String engine;
    private String transmission;
    private Long seats;
    private String fuel;
    private Long year;
    private String imageUrl;
    private String carModelCode;

    @Indexed
    private String customerId;
    private String customerCode;
    private String customerName;
    private String customerPhoneNumber;
    private String customerIdentityNumber;

    private String status;
    private Date createDate;
    private String createBy;
    private Date updateDate;
    private String updateBy;
}
