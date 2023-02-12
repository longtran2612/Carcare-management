package iuh.nhom7.khoa_luan_backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import java.util.Date;

/**
 * 3:43 PM 20-Sep-22
 * Long Tran
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserCreateDTO {

    @NotBlank(message = "Số điện thoại không được để trống")
    private String phone;

    @NotBlank(message = "Họ tên không được để trống")
    private String fullname;

    @NotBlank(message = "Email không được để trống")
    private String email;
    private Date birthDay;
    private String gender;
    private String identityNumber;
    private Integer identityType;
    private String nationality;
    private String address;
    private String province;
    private String provinceCode;
    private String district;
    private String districtCode;
    private String ward;
    private String wardCode;
}
