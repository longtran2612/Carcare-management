package iuh.nhom7.khoa_luan_backend.request.promotion.detail;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.util.List;

/**
 * 2:52 PM 26-Nov-22
 * Long Tran
 */

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SearchPromotionRequest {
    private List<String> serviceIds;
    private List<String> categoryIds;
    private Integer customerType;

}
