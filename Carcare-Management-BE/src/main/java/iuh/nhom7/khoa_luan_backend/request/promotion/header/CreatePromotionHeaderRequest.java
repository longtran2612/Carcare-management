package iuh.nhom7.khoa_luan_backend.request.promotion.header;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreatePromotionHeaderRequest {
    private String promotionHeaderCode;
    private String description;
    private Date fromDate;
    private Date toDate;
}
