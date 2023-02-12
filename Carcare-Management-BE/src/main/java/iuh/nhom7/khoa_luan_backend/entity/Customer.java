package iuh.nhom7.khoa_luan_backend.entity;

import iuh.nhom7.khoa_luan_backend.common.CustomerStatus;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document("customers")
public class Customer {
    @Id
    private String id;
    @Indexed
    private String customerCode;
    private String name;
    private Date dateOfBirth;
    private String gender;
    private String nationality;
    private String province;
    private String provinceCode;
    private String district;
    private String districtCode;
    private String ward;
    private String wardCode;
    private String address;
    @Indexed
    private String identityNumber;
    private Integer identityType;
    @Indexed
    private String phoneNumber;
    private String email;
    private String image;

    // workflow
    @Builder.Default
    private int status = CustomerStatus.OPPORTUNITY;
    private String statusName;
    private Date createDate;
    private String createBy;
    private Date updateDate;
    private String updateBy;
}
