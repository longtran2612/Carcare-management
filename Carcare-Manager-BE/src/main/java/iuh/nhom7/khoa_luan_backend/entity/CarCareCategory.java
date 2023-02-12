package iuh.nhom7.khoa_luan_backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 * 8:34 PM 15-Sep-22
 * Long Tran
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "service_category")
@Builder
public class CarCareCategory {

    @Id
    private String id;
    @Indexed
    private String categoryCode;
    private String name;
    private String type;
    private String status;
    private String imageUrl;

    private Date createDate;
    private String createBy;
    private Date updateDate;
    private String updateBy;
}
