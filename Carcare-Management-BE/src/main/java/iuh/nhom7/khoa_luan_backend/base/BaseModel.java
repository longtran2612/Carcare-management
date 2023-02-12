package iuh.nhom7.khoa_luan_backend.base;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

/**
 * 9:14 PM 20-Sep-22
 * Long Tran
 */

@Getter
@Setter
public class BaseModel {
    private Date createDate;
    private String createBy;
    private Date updateDate;
    private String updateBy;
}
