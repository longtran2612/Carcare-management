package iuh.nhom7.khoa_luan_backend.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.util.Date;

/**
 * 7:40 PM 20-Sep-22
 * Long Tran
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class PriceHeaderCreateDTO {
    private String name;
    private String description;
    private Date fromDate;
    private Date toDate;
}
