package iuh.nhom7.khoa_luan_backend.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest implements Serializable {
	private static final long serialVersionUID = -5310988958830848139L;
	
	private String name;
    private String email;
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
    private String image;
	private Date birthDay;
	private String status;
}
