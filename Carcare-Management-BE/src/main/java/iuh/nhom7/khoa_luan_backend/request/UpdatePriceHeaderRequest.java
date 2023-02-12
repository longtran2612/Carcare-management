package iuh.nhom7.khoa_luan_backend.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePriceHeaderRequest {
    private String name;
    private String description;
    private Date fromDate;
    private Date toDate;
}
