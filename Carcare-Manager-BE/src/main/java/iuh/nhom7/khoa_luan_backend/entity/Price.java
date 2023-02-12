package iuh.nhom7.khoa_luan_backend.entity;

import iuh.nhom7.khoa_luan_backend.common.PriceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 8:40 PM 15-Sep-22
 * Long Tran
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Document
@Builder
public class Price {
    @Id
    private String id;
    @Indexed
    private String priceCode;
    private String name;
    private String type;
    private BigDecimal price;
    private String currency;

    @Indexed
    private String serviceId;
    private String serviceCode;
    @Indexed
    private String priceHeaderId;
    private String priceHeaderCode;

    @Builder.Default
    private int status = PriceStatus.INACTIVE;
    private String statusName;
    private Date createDate;
    private String createBy;
    private Date updateDate;
    private String updateBy;
}
