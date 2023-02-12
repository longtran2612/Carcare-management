package iuh.nhom7.khoa_luan_backend.response;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Setter
@Getter
public class CarCareCategoryResponse {
    private String id;
    private String name;
    private String type;
    private String status;
    private String imageUrl;

    private Object createDate;
    private String createBy;
    private Object updateDate;
    private String updateBy;
}
