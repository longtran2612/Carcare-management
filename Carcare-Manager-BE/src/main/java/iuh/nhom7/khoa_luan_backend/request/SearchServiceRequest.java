package iuh.nhom7.khoa_luan_backend.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import iuh.nhom7.khoa_luan_backend.base.BasePageAndSortRequest;
import lombok.*;

/**
 * 9:03 PM 07-Nov-22
 * Long Tran
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SearchServiceRequest {
    private String keyword;

    private String serviceCode;
    private String name;
    private Integer status;
    private String type;
    private String categoryId;

}
