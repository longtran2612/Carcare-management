package iuh.nhom7.khoa_luan_backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 * 1:04 PM 17-Sep-22
 * Long Tran
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection ="user_group")
public class UserGroup  {
    @Id
    private String id;
    private String name;
    private String description;

    private Date createDate;
    private String createBy;
    private Date updateDate;
    private String updateBy;


}
