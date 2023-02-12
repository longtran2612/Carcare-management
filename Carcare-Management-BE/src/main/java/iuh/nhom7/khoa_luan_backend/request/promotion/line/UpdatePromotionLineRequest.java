package iuh.nhom7.khoa_luan_backend.request.promotion.line;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class UpdatePromotionLineRequest {
    private String promotionLineCode;
    private String description;
    private String type;
    private Date fromDate;
    private Date toDate;
}
