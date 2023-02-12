package iuh.nhom7.khoa_luan_backend.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

/**
 * 4:38 PM 20-Sep-22
 * Long Tran
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "car_slot")
public class CarSlot {
    @Id
    private String id;
    private String carSlotCode;
    private String name;
    private String slotNumber;

    private String orderId;
    private String orderCode;
    private String orderCustomerCode;
    private String orderCustomerName;
    private String orderCustomerPhoneNumber;
    private String orderCarCode;
    private String orderCarName;
    private String orderCarLicensePlate;
    private double orderTotalEstimateTime;
    private String orderStatusName;
    private Date orderStartExecuting;

    private String status;
    private Date createDate;
    private String createBy;
    private Date updateDate;
    private String updateBy;

}
