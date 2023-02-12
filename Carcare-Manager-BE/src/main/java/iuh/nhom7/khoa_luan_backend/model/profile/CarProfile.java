package iuh.nhom7.khoa_luan_backend.model.profile;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import iuh.nhom7.khoa_luan_backend.entity.CarModel;
import iuh.nhom7.khoa_luan_backend.entity.User;
import lombok.*;


import java.util.Date;

/**
 * 2:30 PM 25-Sep-22
 * Long Tran
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CarProfile {
    private String id;
    private String name;
    private String color;
    private String status;
    private String licensePlate;
    private String description;
    private User user;
    private CarModel carModel;
    private String imageUrl;

    private Date createDate;
    private String createBy;
    private Date updateDate;
    private String updateBy;
}
