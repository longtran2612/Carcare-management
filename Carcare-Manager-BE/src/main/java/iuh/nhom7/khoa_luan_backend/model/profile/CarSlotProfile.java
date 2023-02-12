package iuh.nhom7.khoa_luan_backend.model.profile;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import iuh.nhom7.khoa_luan_backend.entity.Car;
import iuh.nhom7.khoa_luan_backend.entity.Price;
import lombok.*;
import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.List;

/**
 * 2:28 PM 25-Sep-22
 * Long Tran
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CarSlotProfile {
    private String id;
    private String carSlotCode;
    private String name;
    private String slotNumber;

    private String orderId;
    private String orderCode;
    private String orderCustomerName;
    private String orderCustomerPhoneNumber;
    private String orderCarLicensePlate;
    private double orderTotalEstimateTime;
    private String orderStatusName;

    private Date orderStartExecuting;
    private Date orderEndExecuting;
    private double orderTotalExecuteTime;

    private String status;
    private Date createDate;
    private String createBy;
    private Date updateDate;
    private String updateBy;
}
