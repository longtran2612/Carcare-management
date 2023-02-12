package iuh.nhom7.khoa_luan_backend.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "promotion_lines")
public class PromotionLine {
    @Id
    private String id;
    private String promotionLineCode;
    private String description;
    private String type;
    private Date fromDate;
    private Date toDate;

    private String promotionHeaderId;

    private String status;
    private Date createDate;
    private String createBy;
    private Date updateDate;
    private String updateBy;
}
