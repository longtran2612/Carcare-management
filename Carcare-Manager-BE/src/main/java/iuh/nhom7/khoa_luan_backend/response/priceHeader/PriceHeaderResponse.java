package iuh.nhom7.khoa_luan_backend.response.priceHeader;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PriceHeaderResponse {
    private String id;

    private String priceHeaderCode;
    private String name;
    private String description;
    private String status;
    private Object fromDate;
    private Object toDate;

    private Object createDate;
    private String createBy;
    private Object updateDate;
    private String updateBy;
}
