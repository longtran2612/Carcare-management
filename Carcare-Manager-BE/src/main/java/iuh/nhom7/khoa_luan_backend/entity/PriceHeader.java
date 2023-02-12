package iuh.nhom7.khoa_luan_backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Set;

/**
 * 7:15 PM 20-Sep-22
 * Long Tran
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "price_header")
@Builder
public class PriceHeader {

    @Id
    private String id;
    @Indexed
    private String priceHeaderCode;
    private String name;
    private String description;
    private Date fromDate;
    private Date toDate;

    private Set<String> serviceIds;

    private String status;
    private Date createDate;
    private String createBy;
    private Date updateDate;
    private String updateBy;
}
