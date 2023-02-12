package iuh.nhom7.khoa_luan_backend.entity;

import iuh.nhom7.khoa_luan_backend.model.PriceModel;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 * 8:30 PM 15-Sep-22
 * Long Tran
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "service")
public class CarCareService {
    @Id
    private String id;
    @Indexed
    private String serviceCode;
    private String type;
    private String name;
    private String description;
    private double estimateTime;
    @Indexed
    private String categoryId;
    private String categoryCode;
    private String categoryName;
    private String imageUrl;

    private PriceModel servicePrice;

    private int status;
    private String statusName;
    private Date createDate;
    private String createBy;
    private Date updateDate;
    private String updateBy;
}
