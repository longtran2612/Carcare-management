package iuh.nhom7.khoa_luan_backend.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import iuh.nhom7.khoa_luan_backend.exception.ErrorCode;
import lombok.*;

import javax.validation.constraints.NotEmpty;
import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreateCustomerRequest {
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
//    @NotEmpty(message = ErrorCode.IDENTITY_NUMBER_EMPTY)
    private String identityNumber;
    private Integer identityType;
    @NotEmpty(message = ErrorCode.PHONE_NUMBER_EMPTY)
    private String phoneNumber;
    private String email;
    private String image;
    private Integer status;
}
