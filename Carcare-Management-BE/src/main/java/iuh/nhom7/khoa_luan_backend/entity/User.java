package iuh.nhom7.khoa_luan_backend.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.IndexDirection;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;


@Document
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class User {
    @Id
    private String id;
    private String name;
    private String userCode;
    @Indexed(background = true, direction = IndexDirection.ASCENDING)
    private String phone;
    private String email;
    private Date birthDay;
    private String image;
    private String gender;

    @Indexed
    private String identityNumber;
    private Integer identityType;

    private String nationality;
    private String province;
    private String provinceCode;
    private String district;
    private String districtCode;
    private String ward;
    private String wardCode;
    private String address;

    private boolean executing;
    private String status;
    private Date createDate;
    private String createBy;
    private Date updateDate;
    private String updateBy;

}
